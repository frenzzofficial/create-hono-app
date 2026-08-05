import { serve } from "@hono/node-server";
import type { Hono } from "hono";
import app from "../index.js";
import { appConfig } from "../packages/configs/app.config.js";

const startServer = (app: Hono): void => {
	try {
		const server = serve({
			fetch: app.fetch,
			hostname: appConfig.app.host,
			port: appConfig.app.port,
		});

		if (appConfig.app.environment === "development") {
			console.log(`🚀 Server running on ${appConfig.site.url}`);
			console.log(`📚 API docs available at ${appConfig.site.documentation}`);
		}

		const shutdown = (): void => {
			console.log("\n🔌 Shutting down gracefully...");

			server.close(() => {
				process.exit(0);
			});
		};

		process.once("SIGINT", shutdown);
		process.once("SIGTERM", shutdown);
	} catch (error) {
		console.error("❌ Failed to start server:", error instanceof Error ? error.message : error);

		process.exit(1);
	}
};

startServer(app);
