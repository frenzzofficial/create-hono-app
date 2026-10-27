// Local development server only (`bun run dev` / `bun run start`).
// On Vercel the app is served from src/index.ts, never from here.

import { appConfig } from "../packages/configs/app.config";
import { logger } from "../packages/utils/logger";
import { createApp } from "./main";

const startServer = (): void => {
	try {
		const app = createApp();

		// Bun calls `fetch(request, server)`, so Hono receives the server as `c.env`
		// (the rate limiter reads the client IP from it).
		const server = Bun.serve({
			hostname: appConfig.app.host,
			port: appConfig.app.port,
			fetch: app.fetch,
		});

		logger.info("server started", {
			url: `http://${appConfig.app.host}:${appConfig.app.port}`,
			environment: appConfig.app.NODE_ENV,
		});

		const shutdown = (): void => {
			logger.info("shutting down gracefully");

			void server.stop().then(() => process.exit(0));
		};

		process.once("SIGINT", shutdown);
		process.once("SIGTERM", shutdown);
	} catch (error) {
		logger.error("failed to start server", {
			message: error instanceof Error ? error.message : String(error),
		});

		process.exit(1);
	}
};

startServer();
