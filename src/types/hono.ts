import type { Context, Hono, MiddlewareHandler } from "hono";

// Explicit generics so `Context`/`Hono` don't fall back to Hono's `any` defaults
// (`type-coverage --strict` counts those as untyped).
export type AppEnv = {
	Bindings: Record<string, never>;
	Variables: Record<string, never>;
};

export type AppContext = Context<AppEnv, string>;
export type AppHono = Hono<AppEnv>;
export type AppMiddleware = MiddlewareHandler<AppEnv, string>;

// Pins the handler's generics so its `c` parameter isn't inferred with `any`.
export const defineMiddleware = (handler: AppMiddleware): AppMiddleware => handler;
