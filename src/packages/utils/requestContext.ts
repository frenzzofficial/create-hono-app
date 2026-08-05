import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
	requestId: string;
	method: string;
	path: string;
	userId?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/** Reads the current request's context from anywhere in the call stack. */
export const getRequestContext = (): RequestContext | undefined => requestContextStorage.getStore();

/** Convenience accessor — falls back for logs fired outside a request (startup, cron). */
export const getRequestId = (): string => getRequestContext()?.requestId ?? "no-request-id";

/**
 * Called once per request, as early as possible in the middleware chain.
 * Everything downstream (controllers, services, asyncHandler's logging)
 * runs inside this callback and can call getRequestContext()/getRequestId()
 * without the request ID ever being passed as a function parameter.
 */
export const runWithRequestContext = <T>(
	context: RequestContext,
	fn: () => Promise<T>,
): Promise<T> => requestContextStorage.run(context, fn);

/** Lets the auth middleware attach the userId once it's known, for log correlation. */
export const setRequestUserId = (userId: string): void => {
	const store = requestContextStorage.getStore();
	if (store) store.userId = userId;
};
