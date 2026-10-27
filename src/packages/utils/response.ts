import type { Context } from "hono";

type JsonStatus = Parameters<Context["json"]>[1];

const jsonStatus = (status: number): JsonStatus => status as JsonStatus;

export const ok = <T>(c: Context, data: T, status = 200) =>
	c.json({ success: true, data }, jsonStatus(status));

// export const err = (c: Context, message: string, status = 500) =>
// 	c.json({ success: false, error: message }, jsonStatus(status));
