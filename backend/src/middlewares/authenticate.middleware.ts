import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../db/postgres.ts";
import { envConfig } from "../envConfig.ts";
import { ApiError } from "../utils/apiResponse.utils.ts";
import type { JwtPayload, UserRow } from "../types/auth.types.ts";

const COOKIE_NAME = "access_token";

/**
 * authenticate middleware
 *
 * Reads the JWT from the httpOnly `access_token` cookie.
 * On success it attaches the full SafeUser to `req.user` and calls next().
 * On failure it throws an ApiError which is caught by the global error handler.
 */
export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // 1. Extract token from cookie
        const token: string | undefined = req.cookies?.[COOKIE_NAME];
        if (!token) throw ApiError.unauthorized("No authentication token provided");

        // 2. Verify signature & expiry
        let payload: JwtPayload;
        try {
            payload = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
        } catch {
            throw ApiError.unauthorized("Invalid or expired token");
        }

        // 3. Fetch fresh user from DB (ensures revoked / deleted users are blocked)
        const { rows } = await pool.query<UserRow>(
            "SELECT * FROM users WHERE id = $1 LIMIT 1",
            [payload.sub]
        );

        const user = rows[0];
        if (!user) throw ApiError.unauthorized("User no longer exists");
        if (!user.is_active) throw ApiError.forbidden("Account has been deactivated");

        // 4. Attach safe user (omit password_hash) to request
        const { password_hash: _pw, ...safeUser } = user;
        req.user = safeUser;

        next();
    } catch (err) {
        next(err);
    }
};
