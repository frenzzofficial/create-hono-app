import { type AppHono, defineMiddleware } from "../../types/hono";

import { envAppConfig } from "../env/app.env";
import { AppError } from "../utils/errors";

// Rejects oversized requests by checking Content-Length before any body parsing happens.
// A request without Content-Length (e.g. chunked transfer encoding) is allowed through;
// the runtime's own server-level limit is the backstop for that case.
export const registerBodyLimit = (app: AppHono): void => {
	app.use(
		"*",
		defineMiddleware(async (c, next) => {
			const contentLength = c.req.header("content-length");
			if (contentLength !== undefined) {
				const size = Number(contentLength);
				if (Number.isFinite(size) && size > envAppConfig.BODY_LIMIT_BYTES) {
					throw AppError.payloadTooLarge(
						`Request body too large: ${size} bytes exceeds the ${envAppConfig.BODY_LIMIT_BYTES} byte limit`,
					);
				}
			}
			await next();
		}),
	);
};
