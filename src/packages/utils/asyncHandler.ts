// Single error-handling boundary for every async function in the app.
// Wrap a function once at its definition — no try/catch at call sites, no
// try/catch repeated inside every service function.
//
// Default behavior (no custom mapper):
//   - AppError thrown inside `fn`           → passes through untouched
//   - ZodError thrown inside `fn`           → converted to a 422 AppError
//   - anything else (bug, DB/network error) → logged in full server-side,
//                                              converted to a generic 500
//                                              AppError so internals never
//                                              leak to the client
//
// Custom mapper (optional 3rd arg) — for the cases where "unknown error → 500"
// is the wrong translation, e.g. a JWT verification failure should become a
// 401 "session expired", not a 500. Pass a mapper to override just that.

import { ZodError } from "zod";
import { AppError } from "./errors.js";
import { logger } from "./logger.js";

type ErrorMapper = (error: unknown) => AppError;

const defaultErrorMapper: ErrorMapper = (error) => {
	if (error instanceof AppError) return error;

	if (error instanceof ZodError) {
		const issue = error.issues[0];
		return new AppError(
			issue ? `${issue.path.join(".")}: ${issue.message}` : "Validation failed",
			422,
		);
	}

	return AppError.internal("Unexpected error occurred");
};

/**
 * Wraps an async function so every thrown error is normalized to AppError.
 *
 * @param label - identifies the failure in server logs (Vercel function
 *   logs), e.g. the exported function name. Never shown to the client.
 * @param fn - the actual async logic. Write it with zero try/catch —
 *   `throw AppError.conflict(...)` etc. for expected failures still works
 *   exactly as before; it passes straight through.
 * @param mapError - optional override for how a *non-AppError* is turned
 *   into an AppError. Defaults to "log it, return a generic 500".
 */
export const asyncHandler = <Args extends unknown[], T>(
	label: string,
	fn: (...args: Args) => Promise<T>,
	mapError: ErrorMapper = defaultErrorMapper,
) => {
	return async (...args: Args): Promise<T> => {
		try {
			return await fn(...args);
		} catch (error) {
			// Only log when it's not an AppError the caller raised on purpose —
			// AppErrors are expected control flow (conflict, unauthorized, etc.),
			// not bugs, so logging them on every request would just be noise.
			if (!(error instanceof AppError)) {
				logger.error(`[${label}] unhandled error`, {
					label,
					errorMessage: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
				});
			}
			throw mapError(error);
		}
	};
};
