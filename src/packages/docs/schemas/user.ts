// docs/schema/users.ts

export const userSchema = {
	type: "object",
	required: [
		"id",
		"fullname",
		"email",
		"avatarUrl",
		"role",
		"status",
		"emailVerifiedAt",
		"createdAt",
		"updatedAt",
	],
	properties: {
		id: {
			type: "string",
			format: "uuid",
		},

		fullname: {
			type: "string",
		},

		email: {
			type: "string",
			format: "email",
		},

		avatarUrl: {
			type: ["string", "null"],
			format: "uri",
		},

		role: {
			type: "string",
			enum: ["USER", "ADMIN"],
		},

		status: {
			type: "string",
			enum: [
				// Keep these values synchronized with userStatusValues
				"ACTIVE",
				"INACTIVE",
				"SUSPENDED",
				"BANNED",
			],
		},

		emailVerifiedAt: {
			type: ["string", "null"],
			format: "date-time",
		},

		createdAt: {
			type: "string",
			format: "date-time",
		},

		updatedAt: {
			type: "string",
			format: "date-time",
		},
	},
	additionalProperties: false,
} as const;
