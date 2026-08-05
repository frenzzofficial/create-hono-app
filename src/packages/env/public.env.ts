import { z } from "zod";
import { envAppConfig } from "./app.env.js";

/**
 * Public environment schema.
 *
 * Everything here is safe to expose — app identity/version info that's
 * fine to surface on a health check, a Swagger page, or to a frontend,
 * plus the CORS/origin allowlist itself (which any client inspecting
 * network requests can already see). Nothing in this file is a secret.
 */
const publicEnvSchema = z.object({
	// App identity — safe to surface on /health, /status, or docs
	APP_NAME: z.string().default("HONO-VERCEL-API"),
	APP_VERSION: z.string().default("1.0.0"),
	APP_DESCRIPTION: z
		.string()
		.default("A Hono web services/backend project starter to host on Vercel"),

	DEFAULT_LOCALE: z.string().default("en"),
	DEFAULT_TIMEZONE: z.string().default("UTC"),

	SITE_ORIGIN: z.url().default(`http://localhost:${envAppConfig.PORT}`),
	SITE_DOCUMENTATION: z.url().default(`http://localhost:${envAppConfig.PORT}/documentation`),
	SITE_API: z.url().default(`http://localhost:${envAppConfig.PORT}${envAppConfig.API_PREFIX}`),
});

const parsedPublicEnv = publicEnvSchema.safeParse(process.env);

if (!parsedPublicEnv.success) {
	console.error("❌ Invalid public environment variables:");

	for (const issue of parsedPublicEnv.error.issues) {
		console.error(`- ${issue.path.join(".")}: ${issue.message}`);
	}

	throw new Error("Public environment validation failed");
}

/**
 * Public, immutable config.
 */
export const envPublicConfig = Object.freeze(parsedPublicEnv.data);

export type EnvPublicConfig = typeof envPublicConfig;
