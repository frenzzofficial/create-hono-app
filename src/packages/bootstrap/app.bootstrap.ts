import type { Hono } from "hono";
import { registerDocsRoutes } from "../../app/docs/docs.routes.js";
import { registerHealthRoutes } from "../../app/health/health.routes.js";
import { registerStaticRoutes } from "../../app/static/static.routes.js";
import { errorHandler } from "../utils/errorHandler.js";
import { registerCsrfProtection } from "./csrf.bootstrap.js";
import { registerMiddlewares } from "./middlewares.bootstrap.js";
import { registerNotFoundRoute } from "./notFound.bootstrap.js";
import { registerRequestLogging } from "./requestId.bootstrap.js";
import { registerRoutes } from "./routes.bootstrap.js";

export const registerBootstrap = (app: Hono): void => {
	// ── Request ID + structured request logging (must be first) ──────────────────
	registerRequestLogging(app);

	// ── CSRF protection (must run before anything touches cookies/session) ───────
	registerCsrfProtection(app);

	// ── Middlewares ──────────────────────────────────────────────────────────────
	registerMiddlewares(app);

	// ── Health check ──────────────────────────────────────────────────────────────
	registerHealthRoutes(app);

	// ── Static Routes (HTML, assets) ──────────────────────────────────────────────────────────────
	registerStaticRoutes(app);

	// ── Register (/app/* Routes) ──────────────────────────────────────────────────────────────
	registerRoutes(app);

	// ── API docs (Swagger UI + OpenAPI JSON, gated by ENABLE_SWAGGER) ──────────────
	registerDocsRoutes(app);

	// ── 404 catch-all ─────────────────────────────────────────────────────────────
	registerNotFoundRoute(app);

	// ── Global error handler ──────────────────────────────────────────────────────────────
	app.onError(errorHandler);
};
