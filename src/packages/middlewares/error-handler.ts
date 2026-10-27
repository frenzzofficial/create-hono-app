import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

type ErrorBody = { success: false; message: string };

const body = (message: string): ErrorBody => ({ success: false, message });

// Single place for all error handling. AppError is the only error type thrown from
// services (see errors.ts) — anything else is a programming error or a framework failure.
// Hono applies `onError` app-wide regardless of registration order.
export const registerErrorHandler = (app: Hono): void => {
	app.onError((error, c) => {
		if (error instanceof AppError) {
			if (!error.isOperational) {
				logger.error("non-operational error", {
					message: error.message,
					stack: error.stack,
				});
			}
			return c.json(body(error.message), error.statusCode as ContentfulStatusCode);
		}

		// Hono throws HTTPException for malformed JSON bodies (400), validators, etc.
		if (error instanceof HTTPException) {
			if (error.status === 400) return c.json(body("Invalid request body"), 400);
			if (error.status < 500) {
				return c.json(
					body(error.message || "Request failed"),
					error.status as ContentfulStatusCode,
				);
			}
		}

		logger.error("unhandled error", {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});

		return c.json(body("Internal server error"), 500);
	});
};
