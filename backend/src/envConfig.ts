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
});

const selectedEnv = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_DB_NAME: process.env.PG_DB_NAME,
};

const env = envSchema.safeParse(selectedEnv);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

export const envConfig = env.data;