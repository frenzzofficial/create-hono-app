import type { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { envClientConfig } from "../env/client.env.js";

export const registerMiddlewares = (app: Hono): void => {
	app.use(
		"*",
		secureHeaders({
			contentSecurityPolicy: {
				defaultSrc: ["'self'"],
				// 'unsafe-inline' + jsdelivr are needed for Swagger UI's bundled
				// init script/styles (see @hono/swagger-ui) — if you turn
				// ENABLE_SWAGGER off, you can drop both and tighten this further.
				scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
				imgSrc: ["'self'", "data:"],
				connectSrc: ["'self'"],
			},
		}),
	);

	app.use(
		"*",
		cors({
			// Credentialed requests (cookies) can never be paired with a
			// wildcard origin — browsers reject that combination outright.
			// Reflect back the request origin only if it's on the allowlist;
			// otherwise omit the header entirely so the browser blocks it.
			origin: (origin) => {
				if (!origin) return undefined;
				return envClientConfig.CLIENT_ORIGINS.includes(origin) ? origin : undefined;
			},
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
		}),
	);
};
