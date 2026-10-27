import type { Hono } from "hono";

import { envAppConfig } from "../env/app.env";
import { logger } from "../utils/logger";

// Logs one line per request: method, path, status and duration, via the shared JSON logger.
//
// Register this FIRST (before the rate limiter and body limit) so the timer wraps them and
// requests rejected by those still get a real duration. Errors thrown downstream are turned
// into responses by `onError` before control returns here, so `c.res.status` is always set.
export const registerRequestLogging = (app: Hono): void => {
	if (!envAppConfig.ENABLE_REQUEST_LOGGING) return;

	app.use("*", async (c, next) => {
		const startedAt = performance.now();
		await next();

		const durationMs = Math.round(performance.now() - startedAt);
		const status = c.res.status;
		const fields = { method: c.req.method, path: c.req.path, status, durationMs };

		if (status >= 500) logger.error("request", fields);
		else logger.info("request", fields);
	});
};
