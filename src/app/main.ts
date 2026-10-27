import { Hono } from "hono";

import { registerBodyLimit } from "../packages/middlewares/body-limit";
import { registerCompression } from "../packages/middlewares/compression";
import { registerCors } from "../packages/middlewares/cors";
import { registerCsrfProtection } from "../packages/middlewares/csrf";
import { registerErrorHandler } from "../packages/middlewares/error-handler";
import { registerNotFound } from "../packages/middlewares/not-found";
import { registerRateLimiter } from "../packages/middlewares/rate-limiter";
import { registerRequestLogging } from "../packages/middlewares/request-logging";
import { registerSecurityHeaders } from "../packages/middlewares/security-headers";
import { registerBootstrap } from "./routes";

export const createApp = (): Hono => {
	const app = new Hono();

	// Error and not-found handlers are app-wide in Hono, so their position doesn't matter.
	registerErrorHandler(app);
	registerNotFound(app);

	// Middleware order DOES matter: `app.use` only wraps routes registered after it, and
	// runs in registration order (the first one registered is the outermost).

	// 1. Logging first, so its timer wraps everything below, including rejections.
	registerRequestLogging(app);

	// 2. Headers/limits/guards that apply to every request, before any route runs.
	registerSecurityHeaders(app);
	registerCors(app);
	registerCompression(app);
	registerBodyLimit(app);
	registerRateLimiter(app);
	registerCsrfProtection(app);

	// 3. Routes. Unversioned first (/, /health), then the versioned API.
	registerBootstrap(app);

	return app;
};
