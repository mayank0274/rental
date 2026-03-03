import app from "./app.ts";
import { envConfig } from "./envConfig.ts";
import logger from "./config/logger.ts";
import pool from "./db/postgres.ts";


const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    logger.info("Postgres connected");

    app.listen(envConfig.PORT, () => {
      logger.info(`Server running on port ${envConfig.PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err}`);
    process.exit(1);
  }
};

startServer();
