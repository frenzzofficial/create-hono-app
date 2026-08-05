// Generic success envelope — data fields spread at root, not nested under "data"
export type ApiSuccess<T> = { success: true; message: string } & T;

// Error envelope matching frontend ApiError type exactly
export type ApiError = {
	success: false;
	message: string;
	statusCode: number;
};
