import { envAppConfig } from "../env/app.env.js";
import { envPublicConfig } from "../env/public.env.js";

const authRoutes = (base: string) => ({
	base,
	signin: "/signin",
	signup: "/signup",
});

export const appConfig = Object.freeze({
	app: {
		name: envPublicConfig.APP_NAME,
		version: envPublicConfig.APP_VERSION,
		description: envPublicConfig.APP_DESCRIPTION,
		environment: envAppConfig.NODE_ENV,
		host: envAppConfig.HOST,
		port: envAppConfig.PORT,
		locale: "en",
		timezone: "UTC",
	},

	site: {
		url: envPublicConfig.SITE_ORIGIN,
		documentation: envPublicConfig.SITE_DOCUMENTATION,
		api: envPublicConfig.SITE_API,
	},

	// Logging
	logging: {
		requests: envAppConfig.LOG_LEVEL === "debug" || envAppConfig.LOG_LEVEL === "info",
		errors: envAppConfig.LOG_LEVEL === "debug" || envAppConfig.LOG_LEVEL === "info",
		stackTrace: envAppConfig.NODE_ENV !== "production",
	},

	// Headers
	headers: {
		requestId: "X-Request-Id",
		traceId: "X-Trace-Id",
		poweredBy: "X-Powered-By",
	},

	// Pagination
	pagination: {
		defaultPage: 1,
		defaultLimit: 20,
		maxLimit: 100,
	},

	// Rate Limiting
	rateLimit: {
		window: envAppConfig.RATE_LIMIT_WINDOW_MS,
		maxRequests: envAppConfig.RATE_LIMIT_MAX_REQUESTS,
	},

	// Feature Flags
	features: {
		swagger: envAppConfig.ENABLE_SWAGGER,
		openApi: envAppConfig.ENABLE_SWAGGER,
		requestLogging: envAppConfig.ENABLE_REQUEST_LOGGING,
		compression: envAppConfig.ENABLE_COMPRESSION,
		cors: envAppConfig.ENABLE_CORS,
		redis: envAppConfig.ENABLE_REDIS,
		smtp: envAppConfig.ENABLE_SMTP,
		rateLimit: envAppConfig.ENABLE_RATE_LIMIT,
	},

	api: {
		prefix: envAppConfig.API_PREFIX, // e.g., "/app"
		version: envAppConfig.API_VERSION, // e.g., "v1"
		base: `${envAppConfig.API_PREFIX}/${envAppConfig.API_VERSION}`, // e.g., "/app/v1"
		health: `${envAppConfig.API_PREFIX}/${envAppConfig.API_VERSION}/health`, // e.g., "/app/v1/health"
		ping: `${envAppConfig.API_PREFIX}/${envAppConfig.API_VERSION}/ping`, // e.g., "/app/v1/ping"
		status: `${envAppConfig.API_PREFIX}/${envAppConfig.API_VERSION}/status`, // e.g., "/app/v1/status"
	},

	// Public Routes
	routes: {
		home: "/",
		about: "/about",
		docs: "/documentation",
		openapi: "/openapi",
		robots: "/robots.txt",
		sitemap: "/sitemap.xml",
		favicon: "/favicon.ico",
	},

	// Assets
	assets: {
		base: "/assets",
		images: "/assets/images",
		icons: "/assets/icons",
		fonts: "/assets/fonts",
		css: "/assets/css",
		js: "/assets/js",
	},

	auth: {
		base: "/auth",
		authEmail: {
			...authRoutes("/auth/email"),
			signout: "/signout",
			refresh: "/refresh",
			me: "/me",
			verifyEmail: "/verify-email",
			forgotPassword: "/forgot-password",
			resetPassword: "/reset-password",
		},
		authPhone: {
			...authRoutes("/auth/phone"),
			sendOtp: "/send-otp",
			verifyOtp: "/verify-otp",
		},
	},

	seo: {
		keywords: ["typescript", "hono", "backend", "rest api", "bun", "node"],
	},
});

export type AppConfig = typeof appConfig;
