import * as dotenv from "dotenv";
import type { Hono } from "hono";
import { registerBootstrap } from "../packages/bootstrap/app.bootstrap.js";

export const registerApp = (app: Hono): void => {
	dotenv.config();
	registerBootstrap(app);
};
