import { appConfig } from "../../configs/app.config.js";

export const systemPaths = {
	"/health": {
		get: {
			tags: ["System"],
			summary: "Health check",
			description:
				"Returns the health status of the application. Intended for uptime monitoring and load balancers.",
			responses: {
				"200": {
					description: "Application is healthy.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									success: {
										type: "boolean",
										example: true,
									},
									message: {
										type: "string",
										example: "Application is healthy.",
									},
									timestamp: {
										type: "string",
										format: "date-time",
									},
								},
							},
						},
					},
				},
			},
		},
	},

	[`${appConfig.api.prefix}/health`]: {
		get: {
			tags: ["System"],
			summary: "API health check",
			description:
				"Returns the health status of the API under the configured application prefix.",
			responses: {
				"200": {
					description: "API is healthy.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									success: {
										type: "boolean",
										example: true,
									},
									message: {
										type: "string",
										example: "API is healthy.",
									},
									timestamp: {
										type: "string",
										format: "date-time",
									},
								},
							},
						},
					},
				},
			},
		},
	},
} as const;
