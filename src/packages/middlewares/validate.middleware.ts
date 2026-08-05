// Centralized request-body validation. Same DRY goal as asyncHandler, one
// layer up: instead of every controller repeating
//   const parsed = schema.safeParse(await c.req.json());
//   if (!parsed.success) throw parsed.error;
// the schema is applied once in the route definition, and the controller
// receives already-validated data via c.get("validated").

import { createMiddleware } from "hono/factory";
import type { z } from "zod";

export const validate = <T extends z.ZodType>(schema: T) =>
	createMiddleware(async (c, next) => {
		const body: unknown = await c.req.json();
		const parsed = schema.safeParse(body);

		if (!parsed.success) {
			// Same ZodError -> 422 path the global error handler already covers —
			// unchanged behavior, just moved out of the controller.
			throw parsed.error;
		}

		c.set("validated", parsed.data);
		await next();
	});
