import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiResponse.utils.ts";
import logger from "../config/logger.ts";

function mapPostgresError(err: any): ApiError | null {
    if (!err || typeof err !== "object" || !("code" in err)) {
        return null;
    }

    switch (err.code) {
        // UNIQUE violation
        case "23505":
            return ApiError.conflict(
                err.constraint?.includes("email")
                    ? "Email already registered"
                    : "Duplicate value violates unique constraint",
            );

        // NOT NULL violation
        case "23502":
            return ApiError.badRequest(
                `Missing required field: ${err.column}`,
            );

        // FOREIGN KEY violation
        case "23503":
            return ApiError.badRequest(
                "Invalid reference to related resource",
            );

        // Invalid input syntax (uuid, number, etc.)
        case "22P02":
            return ApiError.badRequest("Invalid input format");

        default:
            return ApiError.internal("Database error");
    }
}

export const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    let apiError: ApiError;

    if (err instanceof ApiError) {
        apiError = err;
    } else {
        const pgError = mapPostgresError(err);
        if (pgError) {
            apiError = pgError;
        }
        else if (err instanceof Error) {
            apiError = ApiError.internal(err.message);
        } else {
            apiError = ApiError.internal("INTERNAL_SERVER_ERROR");
        }
    }

    logger.error(apiError);
    return res.status(apiError.error.statusCode).json({
        success: false,
        error: apiError.error,
    });
};