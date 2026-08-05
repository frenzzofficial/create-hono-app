import type { Context, Hono } from "hono";
import { appConfig } from "../../packages/configs/app.config.js";
import { ok } from "../../packages/utils/response.js";
import { getHealthStatus } from "./health.service.js";

const handleHealthCheck = async (c: Context) => {
	const health = await getHealthStatus();
	// 503 when the DB is unreachable — this is what actually lets load
	// balancers / uptime monitors distinguish "app is up" from "app is up
	// but can't serve real requests," which a static 200 never could.
	return ok(c, health, health.status === "ok" ? 200 : 503);
};

export const registerHealthRoutes = (app: Hono): void => {
	app.get("/health", handleHealthCheck);
	app.get(`${appConfig.api.prefix}/health`, handleHealthCheck);
};
