import { z } from "zod";

export const healthSchema = z.object({
	status: z.enum(["ok", "degraded", "error"]),
	message: z.string(),
	timestamp: z.string(),
	env: z.string(),
	database: z.enum(["ok", "unreachable"]),
});

export type HealthResponse = z.infer<typeof healthSchema>;
