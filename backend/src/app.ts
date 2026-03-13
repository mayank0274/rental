import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandlerMiddeware } from "./middlewares/errorHandler.middleware.ts";
import authRouter from "./routes/auth.routes.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandlerMiddeware);
export default app;
