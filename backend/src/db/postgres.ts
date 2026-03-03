import { Pool } from "pg";
import { envConfig } from "../envConfig.ts";
import logger from "../config/logger.ts";

const pool = new Pool({
  host: envConfig.PG_HOST,
  port: envConfig.PG_PORT,
  user: envConfig.PG_USER,
  password: envConfig.PG_PASSWORD,
  database: envConfig.PG_DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  logger.error(`Unexpected PG pool error: ${err}`);
  process.exit(1);
});

export default pool;
