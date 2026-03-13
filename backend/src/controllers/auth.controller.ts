import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/postgres.ts";
import { envConfig } from "../envConfig.ts";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.utils.ts";
import { ApiError } from "../utils/apiResponse.utils.ts";
import { ApiSuccessRes } from "../utils/apiResponse.utils.ts";
import { RegisterSchema, LoginSchema } from "../schemas/auth.schemas.ts";
import type { UserRow, SafeUser, JwtPayload } from "../types/auth.types.ts";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12;
const COOKIE_NAME = "access_token";

/** Strip password_hash before returning user to client */
function toSafeUser(user: UserRow): SafeUser {
    const { password_hash: _pw, ...safe } = user;
    return safe;
}

/** Sign a JWT and bake it into an httpOnly cookie */
function setAuthCookie(res: Response, user: SafeUser): void {
    const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    const token = jwt.sign(payload, envConfig.JWT_SECRET, {
        expiresIn: envConfig.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    // Parse the expiry string (e.g. "7d", "1h") into milliseconds for the cookie maxAge
    const durationMs = parseDurationMs(envConfig.JWT_EXPIRES_IN);

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,                          // JS cannot access it
        secure: envConfig.NODE_ENV === "prod",   // HTTPS only in production
        sameSite: "strict",
        maxAge: durationMs,
        path: "/",
    });
}

/** Convert simple duration strings like "7d", "2h", "30m" to ms */
function parseDurationMs(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
    const value = parseInt(match[1]!, 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
        s: 1_000,
        m: 60_000,
        h: 3_600_000,
        d: 86_400_000,
    };
    return value * (multipliers[unit!] ?? 86_400_000);
}

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = asyncErrorHandler(async (req: Request, res: Response) => {
    // 1. Validate input
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) throw ApiError.validationError(parsed.error.flatten().fieldErrors);

    const { name, email, phone, password } = parsed.data;

    // 2. Check for duplicate email
    const emailCheck = await pool.query<{ id: string }>(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email]
    );
    if (emailCheck.rowCount && emailCheck.rowCount > 0) {
        throw ApiError.conflict("An account with this email already exists");
    }

    // 3. Check for duplicate phone (only if provided)
    if (phone) {
        const phoneCheck = await pool.query<{ id: string }>(
            "SELECT id FROM users WHERE phone = $1 LIMIT 1",
            [phone]
        );
        if (phoneCheck.rowCount && phoneCheck.rowCount > 0) {
            throw ApiError.conflict("An account with this phone number already exists");
        }
    }

    // 4. Hash password
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 5. Insert user
    const { rows } = await pool.query<UserRow>(
        `INSERT INTO users (name, email, password_hash, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [name, email, password_hash, phone ?? null]
    );

    const newUser = rows[0];
    if (!newUser) throw ApiError.internal("Failed to create user");

    const safeUser = toSafeUser(newUser);

    // 6. Set cookie + respond
    setAuthCookie(res, safeUser);

    return res
        .status(201)
        .json(new ApiSuccessRes(201, "Account created successfully", safeUser));
});

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = asyncErrorHandler(async (req: Request, res: Response) => {
    // 1. Validate input
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) throw ApiError.validationError(parsed.error.flatten().fieldErrors);

    const { email, password } = parsed.data;

    // 2. Fetch user by email
    const { rows } = await pool.query<UserRow>(
        "SELECT * FROM users WHERE email = $1 LIMIT 1",
        [email]
    );

    const user = rows[0];

    // 3. Use a constant-time comparison — same error message whether user not found or wrong password
    const passwordMatch = user
        ? await bcrypt.compare(password, user.password_hash)
        : false;

    if (!user || !passwordMatch) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    // 4. Block inactive accounts
    if (!user.is_active) {
        throw ApiError.forbidden("Your account has been deactivated");
    }

    const safeUser = toSafeUser(user);

    // 5. Set cookie + respond
    setAuthCookie(res, safeUser);

    return res
        .status(200)
        .json(new ApiSuccessRes(200, "Logged in successfully", safeUser));
});

// ─── Me ───────────────────────────────────────────────────────────────────────
export const me = asyncErrorHandler(async (req: Request, res: Response) => {
    // `req.user` is attached by the `authenticate` middleware
    const user = req.user;
    if (!user) throw ApiError.unauthorized();

    return res
        .status(200)
        .json(new ApiSuccessRes(200, "User profile retrieved", user));
});

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = asyncErrorHandler(async (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res.status(200).json(new ApiSuccessRes(200, "Logged out successfully"));
});
