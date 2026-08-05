// Structured JSON logger. Every line has the same shape — timestamp, level,
// requestId, message, plus arbitrary context fields — so it's queryable in
// Vercel's log viewer or any log drain, instead of grepping free-text lines.
// requestId is pulled automatically from AsyncLocalStorage; callers never
// need to pass it in.

import { getRequestId } from "./requestContext.js";

type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

const write = (level: LogLevel, message: string, fields?: LogFields): void => {
	const line = {
		timestamp: new Date().toISOString(),
		level,
		requestId: getRequestId(),
		message,
		...fields,
	};

	const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
	out(JSON.stringify(line));
};

export const logger = {
	info: (message: string, fields?: LogFields): void => write("info", message, fields),
	warn: (message: string, fields?: LogFields): void => write("warn", message, fields),
	error: (message: string, fields?: LogFields): void => write("error", message, fields),
};
