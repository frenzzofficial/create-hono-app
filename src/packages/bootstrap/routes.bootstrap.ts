import type { Hono as HonoType } from "hono";
import { Hono } from "hono";
import { appConfig } from "../configs/app.config.js";

export const registerRoutes = (app: HonoType): void => {
	// All API routes are registered here
	const api = new Hono();

	// Mount every registered API route under /app
	app.route(appConfig.api.prefix, api);
};
