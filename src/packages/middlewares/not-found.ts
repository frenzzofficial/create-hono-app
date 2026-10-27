import type { AppContext, AppHono } from "../../types/hono";

// Explicit handler for anything no route matched, so a 404 body is built the same way as
// every other response. Hono's `notFound` is app-wide, so registration order doesn't matter.
export const registerNotFound = (app: AppHono): void => {
	app.notFound((c: AppContext) =>
		c.json({ success: false, message: `Route not found: ${c.req.method} ${c.req.path}` }, 404),
	);
};
