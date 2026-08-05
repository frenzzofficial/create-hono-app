import { z } from "zod";
import { envClientConfig } from "./client.env.js";

const serverEnvSchema = z.object({
	// Bind host/port for the server process — not the public-facing
	HOST: z.string().default("localhost"),
	PORT: z.coerce.number().default(7164),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	API_PREFIX: z.string().default("/app"),
	API_VERSION: z.string().default("v1"),

	APP_SECRET: z
		.string()
		.min(10, "APP_SECRET must be at least 10 characters")
		.default("super-secret-key"),

	RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
	RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

	LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

	ENABLE_COMPRESSION: z.coerce.boolean().default(true),
	ENABLE_CORS: z.coerce.boolean().default(true),
	ENABLE_REDIS: z.coerce.boolean().default(false),
	ENABLE_SMTP: z.coerce.boolean().default(false),
	ENABLE_SWAGGER: z.coerce.boolean().default(true),
	ENABLE_RATE_LIMIT: z.coerce.boolean().default(true),
	ENABLE_REQUEST_LOGGING: z.coerce.boolean().default(true),

	ENABLE_CORS_PROTECTION: z.coerce.boolean().default(true),
	ENABLE_CSRF_PROTECTION: z.coerce.boolean().default(true),
});

const parsedServerEnv = serverEnvSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
	console.error("❌ Invalid app environment variables:");

	for (const issue of parsedServerEnv.error.issues) {
		console.error(`- ${issue.path.join(".")}: ${issue.message}`);
	}

	throw new Error("App environment validation failed");
}

export const envAppConfig = Object.freeze({
	...parsedServerEnv.data,
	...envClientConfig,
});

export type EnvAppConfig = typeof envAppConfig;
