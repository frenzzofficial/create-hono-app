import { getCookie, setCookie } from "hono/cookie";
import { type AppHono, defineMiddleware } from "../../types/hono";

import { envAppConfig } from "../env/app.env";
import { AppError } from "../utils/errors";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const generateToken = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Double-submit cookie CSRF protection. Only matters for browser clients that send
// cookies automatically — requests carrying an Authorization header are skipped.
//
// - Every response without the cookie gets one issued (readable by JS, NOT httpOnly —
//   the client must be able to read it to echo it back).
// - Every mutating request must repeat that value in the `x-csrf-token` header.
export const registerCsrfProtection = (app: AppHono): void => {
	if (!envAppConfig.ENABLE_CSRF_PROTECTION) return;

	app.use(
		"*",
		defineMiddleware(async (c, next) => {
			let token = getCookie(c, CSRF_COOKIE_NAME);
			if (!token) {
				token = generateToken();
				setCookie(c, CSRF_COOKIE_NAME, token, {
					httpOnly: false,
					path: "/",
					sameSite: "Lax",
					secure: envAppConfig.NODE_ENV === "production",
				});
			}

			if (!SAFE_METHODS.has(c.req.method) && !c.req.header("authorization")) {
				const headerToken = c.req.header(CSRF_HEADER_NAME);
				if (!headerToken || headerToken !== token) {
					throw AppError.forbidden("Invalid or missing CSRF token");
				}
			}

			await next();
		}),
	);
};
