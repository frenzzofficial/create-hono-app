import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { AppContext } from "../../types/hono";

export const ok = <T>(c: AppContext, data: T, status: ContentfulStatusCode = 200) =>
	c.json({ success: true, data }, status);
