import { errorSchemas } from "./schemas/error.js";
import { userSchema } from "./schemas/user.js";

export const components = {
	securitySchemes: {
		cookieAuth: {
			type: "apiKey",
			in: "cookie",
			name: "access_token",
			description: "Authentication using the access_token HTTP cookie.",
		},
	},

	schemas: {
		User: userSchema,
		...errorSchemas,
	},
} as const;
