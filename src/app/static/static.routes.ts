import type { Context, Hono } from "hono";
import { getHTML, getStaticAsset } from "../../packages/utils/static-files.js";

const STATIC_PAGES = new Map<string, string>([
	["/", "html/Homepage.html"],
	["/home", "html/Homepage.html"],
]);

const pageHandler = async (c: Context, file: string): Promise<Response> => {
	const html = await getHTML(file);

	if (!html) {
		return c.notFound();
	}

	return c.html(html);
};

export const registerStaticRoutes = (app: Hono): void => {
	// HTML pages
	for (const [route, file] of STATIC_PAGES) {
		app.get(route, (c) => pageHandler(c, file));
	}

	// Static assets
	app.get("/assets/*", async (c) => {
		const assetPath = c.req.path.slice("/assets/".length);
		const asset = await getStaticAsset(assetPath);

		if (!asset) {
			return c.notFound();
		}

		c.header("Content-Type", asset.contentType);
		c.header("Cache-Control", "public, max-age=31536000, immutable");

		return c.body(new Uint8Array(asset.body));
	});
};
