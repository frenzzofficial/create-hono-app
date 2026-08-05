import { appConfig } from "../../configs/app.config.js";

const { assets } = appConfig;

export const assetPaths = {
	[`${assets.base}/{path}`]: {
		get: {
			tags: ["Assets"],
			summary: "Serve a static asset",
			description:
				"Returns a static asset such as an image, icon, font, stylesheet, or JavaScript file.",

			parameters: [
				{
					name: "path",
					in: "path",
					required: true,
					description: "Relative path to the asset under the assets directory.",
					schema: {
						type: "string",
						example: "images/logo.png",
					},
				},
			],

			responses: {
				"200": {
					description: "Asset returned successfully.",
					content: {
						"*/*": {
							schema: {
								type: "string",
								format: "binary",
							},
						},
					},
				},

				"404": {
					description: "Asset not found.",
				},
			},
		},
	},
} as const;
