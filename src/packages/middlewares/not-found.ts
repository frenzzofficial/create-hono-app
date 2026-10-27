import type { Hono } from "hono";

// Explicit handler for anything no route matched, so a 404 body is built the same way as
// every other response. Hono's `notFound` is app-wide, so registration order doesn't matter.
export const registerNotFound = (app: Hono): void => {
	app.notFound((c) =>
		c.json({ success: false, message: `Route not found: ${c.req.method} ${c.req.path}` }, 404),
	);
};
