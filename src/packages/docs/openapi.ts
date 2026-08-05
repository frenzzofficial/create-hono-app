import { appConfig } from "../configs/app.config.js";
import { components } from "./components.js";

import { assetPaths } from "./paths/assets.js";
import { documentationPaths } from "./paths/documentation.js";
import { systemPaths } from "./paths/system.js";
import { websitePaths } from "./paths/website.js";

export const openApiSpec = {
	openapi: "3.0.3",

	info: {
		title: appConfig.app.name,
		version: appConfig.app.version,
		description: appConfig.app.description,
		contact: {
			name: appConfig.app.name,
			url: appConfig.site.url,
		},
		license: {
			name: "MIT",
		},
	},

	servers: [
		{
			url: appConfig.site.url,
			description: "Production",
		},
	],

	components,

	tags: [
		{
			name: "Website",
			description: "Public website pages",
		},
		{
			name: "Documentation",
			description: "OpenAPI and Swagger documentation endpoints",
		},
		{
			name: "Assets",
			description: "Static asset endpoints",
		},
		{
			name: "System",
			description: "Health and system endpoints",
		},
		{
			name: "Email Auth",
			description: "Authentication using email and password",
		},
		{
			name: "Phone Auth",
			description: "Authentication using phone number and OTP",
		},
	],

	paths: {
		...websitePaths,
		...documentationPaths,
		...assetPaths,
		...systemPaths,
	},
} as const;
