import { getHTML, getStaticAsset } from "../../packages/utils/static-files.js";
import type { AppHono } from "../../types/hono";

const STATIC_PAGES = new Map<string, string>([
	["/", "html/index.html"],
	["/home", "html/index.html"],
	["/docs", "html/docs.html"],
]);

export const registerStaticRoutes = (app: AppHono): AppHono => {
	// HTML pages
	for (const [route, file] of STATIC_PAGES) {
		app.get(route, async (c) => {
			const html = await getHTML(file);

			if (!html) return c.text("Not Found", 404);

			return c.html(html);
		});
	}

	// Static assets
	app.get("/assets/*", async (c) => {
		const assetPath = c.req.path.slice("/assets/".length);

		const asset = await getStaticAsset(assetPath);

		if (!asset) return c.text("Not Found", 404);

		return c.body(new Uint8Array(asset.body), 200, {
			"Content-Type": asset.contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		});
	});

	return app;
};
