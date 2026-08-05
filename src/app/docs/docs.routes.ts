import { swaggerUI } from "@hono/swagger-ui";
import type { Hono } from "hono";
import { openApiSpec } from "../../packages/docs/openapi.js";
import { envAppConfig } from "../../packages/env/app.env.js";

// Gated behind ENABLE_SWAGGER (already defined in app.env.ts, previously
// unused) — set ENABLE_SWAGGER=false to hide docs in production if you'd

// rather not expose the schema publicly.
export const registerDocsRoutes = (app: Hono): void => {
	if (!envAppConfig.ENABLE_SWAGGER) return;

	app.get("/openapi.json", (c) => c.json(openApiSpec));
	app.get("/documentation", swaggerUI({ url: "/openapi.json" }));
};
