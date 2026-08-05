// CSRF protection via Origin-header allowlist.
//
// Why this is needed: SameSite=Lax cookies used to give free CSRF protection
// (blocked cross-site POST). Moving to SameSite=None — required for the
// frontend's cross-domain setup — removed that protection entirely. A
// malicious site can otherwise make a victim's browser send an authenticated
// request using their cookies, since cookies attach automatically regardless
// of which site triggered the request.
//
// This checks the Origin header on every mutating request against the same
// CLIENT_ORIGINS allowlist CORS already uses. Safe methods (GET/HEAD/OPTIONS)
// are exempt since they must stay side-effect-free by HTTP convention anyway.

import type { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { envAppConfig } from "../env/app.env.js";
import { envClientConfig } from "../env/client.env.js";
import { AppError } from "../utils/errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const registerCsrfProtection = (app: Hono): void => {
	if (!envAppConfig.ENABLE_CSRF_PROTECTION) {
		return;
	}

	app.use(
		"*",
		createMiddleware(async (c, next) => {
			if (SAFE_METHODS.has(c.req.method)) {
				await next();
				return;
			}

			const origin = c.req.header("origin");

			// No Origin header on a mutating request is itself suspicious for a
			// browser-based client — legitimate fetch/XHR always sends it on
			// cross-origin requests. Reject rather than assume same-origin.
			if (!origin || !envClientConfig.CLIENT_ORIGINS.includes(origin)) {
				throw AppError.forbidden("Request origin not allowed");
			}

			await next();
		}),
	);
};
