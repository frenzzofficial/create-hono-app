import type { Context } from "hono";
import { ZodError } from "zod";
import type { ApiError } from "../../types/api.js";
import { AppError } from "./errors.js";
import { logger } from "./logger.js";
import { jsonStatus } from "./response.js";

export const errorHandler = (error: unknown, c: Context): Response => {
	if (error instanceof AppError) {
		const body: ApiError = {
			success: false,
			message: error.message,
			statusCode: error.statusCode,
		};

		return c.json(body, jsonStatus(error.statusCode));
	}

	if (error instanceof ZodError) {
		const firstIssue = error.issues[0];

		const message = firstIssue
			? `${firstIssue.path.join(".")}: ${firstIssue.message}`
			: "Validation failed";

		const body: ApiError = {
			success: false,
			message,
			statusCode: 422,
		};

		return c.json(body, jsonStatus(422));
	}

	logger.error("unhandled error", {
		errorMessage: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
	});

	const body: ApiError = {
		success: false,
		message: "Internal server error",
		statusCode: 500,
	};

	return c.json(body, jsonStatus(500));
};
