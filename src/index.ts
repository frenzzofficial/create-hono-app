import { Hono } from "hono";
import { registerApp } from "./app/main.js";

const app = new Hono();

registerApp(app);

export default app;
