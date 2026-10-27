import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { appConfig } from "../packages/configs/app.config";
import type { AppEnv, AppHono } from "../types/hono";

// Every versioned route is mounted under a single sub-app, e.g. /api/v1/... .
// Root-level routes that shouldn't be versioned (/, /health) stay outside this
// group — see routes.ts.
//
// Adding a new module: call `v1.route("/module", moduleRoutes)` (or `v1.get(...)`, etc.)
// below. A future v2 becomes a second sub-app with its own prefix, mounted
// independently — existing v1 routes and clients are unaffected.
export const registerApiRoutes = (app: AppHono): void => {
	const v1 = new Hono<AppEnv>();

	v1.get(
		"/",
		describeRoute({
			tags: ["API"],
			summary: "API version info",
			description: "Confirms the API is reachable and reports its version.",
			responses: {
				200: { description: "API is reachable" },
			},
		}),
		(c) =>
			c.json(
				{
					version: appConfig.app.apiVersion,
					message: "Cloak Shield API",
				},
				200,
			),
	);

	app.route(appConfig.api.base, v1);
};
