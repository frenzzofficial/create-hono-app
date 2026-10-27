import { describeRoute } from "hono-openapi";
import { appConfig } from "../../packages/configs/app.config";
import type { HealthResponse } from "../../packages/schema/health.schema";
import { ok } from "../../packages/utils/response";
import type { AppContext, AppHono } from "../../types/hono";
import { getHealthStatus } from "./health.service";

const handleHealthCheck = async (c: AppContext) => {
	const health = (await getHealthStatus()) as HealthResponse;
	// 503 when the DB is unreachable — this is what actually lets load
	// balancers / uptime monitors distinguish "app is up" from "app is up
	// but can't serve real requests," which a static 200 never could.
	return ok(c, health, health.status === "ok" ? 200 : 503);
};

const healthRoute = describeRoute({
	tags: ["Health"],
	summary: "Health check",
	description: "Reports service status, uptime and database connectivity.",
	responses: {
		200: { description: "Service and database are healthy" },
		503: { description: "Database unreachable" },
	},
});

export const registerHealthRoutes = (app: AppHono): void => {
	app.get("/health", healthRoute, handleHealthCheck);
	app.get(`${appConfig.app.apiPrefix}/health`, healthRoute, handleHealthCheck);
};
