import "dotenv/config";

import app from "./app.js";
import connectDB from "./db/db_index.js";
import { connectRedis } from "./db/redis.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info("Server started", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
      });
    });
  } catch (error) {
    logger.error("Application startup failed", {
      error: error.message,
      stack: error.stack,
    });

    process.exitCode = 1;
  }
};

startServer();
