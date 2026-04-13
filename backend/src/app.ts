import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.ts";
import rentalItemsRouter from "./routes/rentalItems.routes.ts";
import uploadRouter from "./routes/upload.routes.ts";
import cors from "cors"

import { envConfig } from "./envConfig.ts";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware.ts";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
        origin: envConfig.FRONTEND_URL,
        credentials: true,
    })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/rentals", rentalItemsRouter);
app.use("/api/upload", uploadRouter);

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandlerMiddleware);
export default app;
