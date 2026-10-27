import type { Context, Hono } from "hono";

import { envAppConfig } from "../env/app.env";
import { AppError } from "../utils/errors";

// Hand-written fixed-window rate limiter, keyed by client IP. No dependency.
//
// Register before routes so it applies globally. A 429 goes through the app's error
// handler, so it keeps the same JSON error shape as everything else.
//
// Fixed window (not sliding): a client can burst up to 2x max at a window boundary.
// O(1) per request with a plain Map. Good enough for a single-instance deployment; swap in
// Redis-backed counting (ENABLE_REDIS already exists as a flag) for multi-instance.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bounds how large `buckets` can grow, so a flood of unique IPs can't leak memory.
// Oldest entries are dropped first once the cap is hit.
const MAX_TRACKED_CLIENTS = 50_000;

type IpResolver = { requestIP: (request: Request) => { address: string } | null };

const hasRequestIP = (env: unknown): env is IpResolver =>
	typeof env === "object" &&
	env !== null &&
	"requestIP" in env &&
	typeof env.requestIP === "function";

// Under `Bun.serve`, Hono passes the Bun server as `c.env`. Elsewhere (tests, Vercel)
// there is no server object, so every client falls back to the shared "unknown" key.
const getClientKey = (c: Context): string =>
	hasRequestIP(c.env) ? (c.env.requestIP(c.req.raw)?.address ?? "unknown") : "unknown";

export const registerRateLimiter = (app: Hono): void => {
	if (!envAppConfig.ENABLE_RATE_LIMIT) return;

	const windowMs = envAppConfig.RATE_LIMIT_WINDOW_MS;
	const max = envAppConfig.RATE_LIMIT_MAX_REQUESTS;

	app.use("*", async (c, next) => {
		const key = getClientKey(c);
		const now = Date.now();

		let bucket = buckets.get(key);
		if (!bucket || bucket.resetAt <= now) {
			if (buckets.size >= MAX_TRACKED_CLIENTS) {
				const oldestKey = buckets.keys().next().value;
				if (oldestKey !== undefined) buckets.delete(oldestKey);
			}
			bucket = { count: 0, resetAt: now + windowMs };
			buckets.set(key, bucket);
		}

		bucket.count += 1;

		const resetSeconds = String(Math.ceil((bucket.resetAt - now) / 1000));
		c.header("ratelimit-limit", String(max));
		c.header("ratelimit-remaining", String(Math.max(0, max - bucket.count)));
		c.header("ratelimit-reset", resetSeconds);

		if (bucket.count > max) {
			c.header("retry-after", resetSeconds);
			throw AppError.tooManyRequests();
		}

		await next();
	});
};
