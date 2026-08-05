export const errorSchemas = {
	ApiError: {
		type: "object",
		required: ["success", "message", "statusCode"],
		properties: {
			success: {
				type: "boolean",
				example: false,
			},
			message: {
				type: "string",
				example: "Something went wrong.",
			},
			statusCode: {
				type: "integer",
				example: 500,
			},
		},
	},

	ValidationError: {
		type: "object",
		required: ["success", "message", "statusCode", "errors"],
		properties: {
			success: {
				type: "boolean",
				example: false,
			},
			message: {
				type: "string",
				example: "Validation failed.",
			},
			statusCode: {
				type: "integer",
				example: 422,
			},
			errors: {
				type: "array",
				items: {
					type: "object",
					required: ["field", "message"],
					properties: {
						field: {
							type: "string",
							example: "email",
						},
						message: {
							type: "string",
							example: "Invalid email address.",
						},
					},
				},
			},
		},
	},
} as const;
