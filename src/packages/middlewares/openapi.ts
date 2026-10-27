import { swaggerUI } from "@hono/swagger-ui";
import type { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

import { envAppConfig } from "../env/app.env";
import { envPublicConfig } from "../env/public.env";

// Serves the OpenAPI spec at /openapi/json and Swagger UI at /openapi.
// Unlike Hono doesn't infer docs from routes automatically: document each route
// with `describeRoute({ tags: ["API"], ... })` from "hono-openapi". Only described routes
// appear in the spec, so HTML pages and static assets need no explicit exclusion.
//
// Needs: `bun add @hono/swagger-ui hono-openapi`
export const registerOpenApi = (app: Hono): void => {
	if (!envAppConfig.ENABLE_SWAGGER) return;

	app.get(
		"/openapi/json",
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: envPublicConfig.APP_NAME,
					version: envPublicConfig.APP_VERSION,
					description: envPublicConfig.APP_DESCRIPTION,
				},
				tags: [
					{ name: "Health", description: "Service and database health checks" },
					{ name: "API", description: "Versioned API endpoints" },
				],
			},
		}),
	);

	app.get(
		"/openapi",
		swaggerUI({
			url: "/openapi/json",
			docExpansion: "list",
			persistAuthorization: true,
		}),
	);
};
