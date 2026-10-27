import { type AppHono, defineMiddleware } from "../../types/hono";

import { envAppConfig } from "../env/app.env";

// Gzip-compresses text/JSON responses when the client sends `Accept-Encoding: gzip`,
// using Bun's built-in `Bun.gzipSync` (no dependency). Bun has no native brotli encoder,
// so only gzip is offered.
//
// NOTE for Vercel deployments: Vercel's edge network already compresses responses, so
// leave ENABLE_COMPRESSION=false there unless you've measured it actually helps.
const MIN_BYTES_TO_COMPRESS = 1024;
const COMPRESSIBLE_TYPE = /^(application\/json|text\/)/i;

export const registerCompression = (app: AppHono): void => {
	if (!envAppConfig.ENABLE_COMPRESSION) return;

	app.use(
		"*",
		defineMiddleware(async (c, next) => {
			await next();

			const res = c.res;
			if (!res.body) return;
			if (res.headers.has("content-encoding")) return;
			if (!(c.req.header("accept-encoding") ?? "").includes("gzip")) return;
			if (!COMPRESSIBLE_TYPE.test(res.headers.get("content-type") ?? "")) return;

			const bytes = new Uint8Array(await res.clone().arrayBuffer());
			if (bytes.byteLength < MIN_BYTES_TO_COMPRESS) return;

			const headers = new Headers(res.headers);
			headers.set("content-encoding", "gzip");
			headers.delete("content-length");
			headers.append("vary", "Accept-Encoding");

			c.res = new Response(Bun.gzipSync(bytes), {
				status: res.status,
				statusText: res.statusText,
				headers,
			});
		}),
	);
};
