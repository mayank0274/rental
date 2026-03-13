// ─── DB row returned from the `users` table ───────────────────────────────────
export interface UserRow {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    phone: string | null;
    is_verified: boolean;
    is_active: boolean;
    role: "user" | "admin";
    created_at: Date;
    updated_at: Date;
}

// ─── Safe user object returned in API responses (no password_hash) ─────────────
export type SafeUser = Omit<UserRow, "password_hash">;

// ─── JWT payload structure ─────────────────────────────────────────────────────
export interface JwtPayload {
    sub: string;        // user uuid
    email: string;
    role: "user" | "admin";
    iat?: number;
    exp?: number;
}

// ─── Augment Express Request so req.user is typed ─────────────────────────────
declare global {
    namespace Express {
        interface Request {
            user?: SafeUser;
        }
    }
}
