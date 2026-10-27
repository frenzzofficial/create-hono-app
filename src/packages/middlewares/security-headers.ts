import { type AppHono, defineMiddleware } from "../../types/hono";

import { envAppConfig } from "../env/app.env";

// Sets standard security response headers (CSP, X-Frame-Options, HSTS, Referrer-Policy,
// Permissions-Policy, ...). This is a JSON API, so the CSP is locked down to "nothing is
// allowed to load" — with ONE exception: the Swagger UI page (/openapi) loads its JS/CSS
// from the jsDelivr CDN (what @hono/swagger-ui uses; see openapi.ts), so it gets a relaxed CSP.
//
// Hand-written — no dependency. Register early so every response gets these headers,
// including error responses.
const HSTS_MAX_AGE_SECONDS = 15_552_000; // 180 days
const SWAGGER_UI_CDN = "https://cdn.jsdelivr.net";

const buildCsp = (isSwaggerUiPage: boolean): string =>
	[
		"default-src 'none'",
		isSwaggerUiPage
			? `script-src 'self' 'unsafe-inline' ${SWAGGER_UI_CDN}`
			: "script-src 'self' 'unsafe-inline'",
		isSwaggerUiPage
			? `style-src 'self' 'unsafe-inline' ${SWAGGER_UI_CDN}`
			: "style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self'",
		isSwaggerUiPage ? `connect-src 'self' ${SWAGGER_UI_CDN}` : "connect-src 'self'",
		"frame-src 'none'",
		"object-src 'none'",
		"base-uri 'none'",
	].join("; ");

const buildPermissionsPolicy = (): string =>
	["camera=()", "microphone=()", "geolocation=()", "interest-cohort=()"].join(", ");

export const registerSecurityHeaders = (app: AppHono): void => {
	if (!envAppConfig.ENABLE_SECURITY_HEADERS) return;

	app.use(
		"*",
		defineMiddleware(async (c, next) => {
			c.header("x-frame-options", "DENY");
			c.header("x-xss-protection", "1; mode=block");
			c.header("x-content-type-options", "nosniff");
			c.header("referrer-policy", "no-referrer");
			c.header("x-dns-prefetch-control", "off");
			c.header("cross-origin-resource-policy", "same-origin");
			c.header("cross-origin-opener-policy", "same-origin");
			c.header("content-security-policy", buildCsp(c.req.path === "/openapi"));
			c.header("permissions-policy", buildPermissionsPolicy());

			if (envAppConfig.NODE_ENV === "production") {
				c.header(
					"strict-transport-security",
					`max-age=${HSTS_MAX_AGE_SECONDS}; includeSubDomains`,
				);
			}

			await next();
		}),
	);
};
