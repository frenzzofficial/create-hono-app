import type { Hono } from "hono";
import type { ApiError } from "../../types/api.js";
import { appConfig } from "../configs/app.config.js";
import { getHTML } from "../utils/static-files.js";

export const registerNotFoundRoute = (app: Hono): void => {
	app.notFound(async (c) => {
		const pathname = c.req.path;

		// API routes return JSON
		if (pathname.startsWith(appConfig.api.prefix)) {
			const body: ApiError = {
				success: false,
				message: `Route ${c.req.method} ${pathname} not found`,
				statusCode: 404,
			};

			return c.json(body, 404);
		}

		// Browser routes return the static 404 page
		const html = await getHTML("html/404.html");

		if (!html) {
			throw new Error("Missing static file: html/404.html");
		}

		return c.html(html, 404);
	});
};
