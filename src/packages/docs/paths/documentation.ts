import { appConfig } from "../../configs/app.config.js";

const { routes } = appConfig;

export const documentationPaths = {
	[routes.docs]: {
		get: {
			tags: ["Documentation"],
			summary: "Interactive API documentation",
			description: "Serves the interactive Swagger UI for exploring and testing the API.",
			responses: {
				"200": {
					description: "Swagger UI returned successfully.",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},

	[routes.openapi]: {
		get: {
			tags: ["Documentation"],
			summary: "OpenAPI specification",
			description: "Returns the OpenAPI 3.0 specification in JSON format.",
			responses: {
				"200": {
					description: "OpenAPI specification returned successfully.",
					content: {
						"application/json": {
							schema: {
								type: "object",
							},
						},
					},
				},
			},
		},
	},
} as const;
