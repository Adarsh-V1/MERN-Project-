import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";
import { logger } from "../utils/logger.js";

async function connectDB() {
  const connectionResponse = await mongoose.connect(
    `${process.env.MONGODB_URI}/${DB_NAME}`
  );

  logger.info("MongoDB connected", {
    host: connectionResponse.connection.host,
    database: connectionResponse.connection.name,
  });

  return connectionResponse;
}

export default connectDB;