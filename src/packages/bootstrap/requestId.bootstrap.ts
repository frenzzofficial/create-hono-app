// Replaces hono/request-id + hono/logger with one middleware that:
//   1. Assigns (or preserves, if the caller already sent one) a request ID
//   2. Opens an AsyncLocalStorage scope so every downstream service/repo/
//      asyncHandler call can read that request ID without it being passed
//      as a function argument anywhere
//   3. Logs exactly one structured JSON line per completed request

import type { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { logger } from "../utils/logger.js";
import { runWithRequestContext } from "../utils/requestContext.js";

export const registerRequestLogging = (app: Hono): void => {
	app.use(
		"*",
		createMiddleware(async (c, next) => {
			// Preserve an inbound request ID (e.g. from a frontend or upstream
			// proxy that already generates one) instead of always overwriting it —
			// standard practice for correlating logs across services.
			const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
			c.header("x-request-id", requestId);

			const start = performance.now();

			await runWithRequestContext(
				{ requestId, method: c.req.method, path: c.req.path },
				async () => {
					await next();

					const durationMs = Math.round(performance.now() - start);

					logger.info("request completed", {
						method: c.req.method,
						path: c.req.path,
						status: c.res.status,
						durationMs,
					});
				},
			);
		}),
	);
};
