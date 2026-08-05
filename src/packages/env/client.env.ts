import { z } from "zod";

const clientEnvSchema = z.object({
	// Primary frontend origin
	CLIENT_ORIGIN: z.url().trim().default("http://localhost:3000"),

	// Frontend API URL
	CLIENT_API_ORIGIN: z.url().trim().default("http://localhost:3000/api"),

	// Comma-separated allowlist of frontend origins.
	// Example:
	// https://app.example.com,https://staging.example.com,http://localhost:3000
	CLIENT_ORIGINS: z
		.string()
		.trim()
		.default("http://localhost:3000")
		.transform((value) =>
			value
				.split(",")
				.map((origin) => origin.trim())
				.filter(Boolean),
		)
		.pipe(z.array(z.url())),
});

const parsedClientEnv = clientEnvSchema.safeParse(process.env);

if (!parsedClientEnv.success) {
	console.error("❌ Invalid client environment variables:");

	for (const issue of parsedClientEnv.error.issues) {
		console.error(`- ${issue.path.join(".")}: ${issue.message}`);
	}

	throw new Error("Client environment validation failed");
}

/**
 * Public, immutable config.
 */
export const envClientConfig = Object.freeze(parsedClientEnv.data);

export type EnvClientConfig = typeof envClientConfig;
