import { appConfig } from "../../configs/app.config.js";

const { routes } = appConfig;

export const websitePaths = {
	[routes.home]: {
		get: {
			tags: ["Website"],
			summary: "Homepage",
			description: "Returns the application's homepage.",
			responses: {
				"200": {
					description: "Homepage returned successfully.",
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

	[routes.about]: {
		get: {
			tags: ["Website"],
			summary: "About",
			description: "Returns the application's about page.",
			responses: {
				"200": {
					description: "About page returned successfully.",
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

	[routes.robots]: {
		get: {
			tags: ["Website"],
			summary: "robots.txt",
			description: "Returns the robots.txt file for search engine crawlers.",
			responses: {
				"200": {
					description: "robots.txt returned successfully.",
					content: {
						"text/plain": {
							schema: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},

	[routes.sitemap]: {
		get: {
			tags: ["Website"],
			summary: "Sitemap",
			description: "Returns the XML sitemap.",
			responses: {
				"200": {
					description: "Sitemap returned successfully.",
					content: {
						"application/xml": {
							schema: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},

	[routes.favicon]: {
		get: {
			tags: ["Website"],
			summary: "Favicon",
			description: "Returns the website favicon.",
			responses: {
				"200": {
					description: "Favicon returned successfully.",
					content: {
						"image/x-icon": {
							schema: {
								type: "string",
								format: "binary",
							},
						},
					},
				},
			},
		},
	},
} as const;
