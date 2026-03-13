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
};

const env = envSchema.safeParse(selectedEnv);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

export const envConfig = env.data;