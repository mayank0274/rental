import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ override: true });

const envSchema = z.object({
    PORT: z.string().transform(Number),
    NODE_ENV: z.enum(["dev", "prod"]),
    PG_HOST: z.string(),
    PG_PORT: z.string().transform(Number),
    PG_USER: z.string(),
    PG_PASSWORD: z.string(),
    PG_DB_NAME: z.string(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    FRONTEND_URL: z.string().url().default("http://localhost:3000"),
    IMAGEKIT_PUBLIC_KEY: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
    IMAGEKIT_URL_ENDPOINT: z.string().url(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().transform(Number).optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),
});

const selectedEnv = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_DB_NAME: process.env.PG_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    FRONTEND_URL: process.env.FRONTEND_URL,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
};

const env = envSchema.safeParse(selectedEnv);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

export const envConfig = env.data;