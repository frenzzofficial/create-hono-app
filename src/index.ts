// Vercel entrypoint for Hono. Zero-config detection needs src/index.ts to import `hono`
// and default-export the app. `Bun.serve`/`serve()` is not used here.
// See: https://vercel.com/docs/frameworks/backend/hono

import { Hono } from "hono";

// Dynamic import with a RELATIVE path: the `@/*` alias is a tsconfig/bundler feature, and
// runtime `import()` specifiers aren't rewritten on Vercel. Wrapped in try/catch so a bad
// env var returns a JSON 500 instead of crashing the process (opaque
// FUNCTION_INVOCATION_FAILED).
const buildApp = async (): Promise<Hono> => {
	try {
		const { createApp } = await import("./app/main");
		// `createApp()` must return a Hono instance.
		const app = new Hono().route("/", createApp());
		return app;
	} catch (thrown: unknown) {
		const message = thrown instanceof Error ? thrown.message : String(thrown);

		// biome-ignore lint/suspicious/noConsole: startup failure must reach Vercel's function logs
		console.error("[startup failed]", message);

		return new Hono().all("*", (c) =>
			c.json({ success: false, message: "Server failed to start", error: message }, 500),
		);
	}
};

const app = await buildApp();

export default app;
