import type { Hono } from "hono";
import { cors } from "hono/cors";

import { envAppConfig } from "../env/app.env";
import { envClientConfig } from "../env/client.env";

// Allowlists CLIENT_ORIGINS (already parsed + validated — see env/client.env.ts).
// `credentials: true` because CSRF protection relies on a cookie (see middlewares/csrf.ts).
//
// Register this early, before any route, so preflight (OPTIONS) requests are answered
// before hitting the rate limiter or CSRF check.
export const registerCors = (app: Hono): void => {
	if (!envAppConfig.ENABLE_CORS) return;

	app.use(
		"*",
		cors({
			origin: envClientConfig.CLIENT_ORIGINS,
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
		}),
	);
};
