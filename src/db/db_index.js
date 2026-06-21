import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";
import { logger } from "../utils/logger.js";

let connectionPromise;

function getMongoUri() {
  const configuredUri = process.env.MONGODB_URI?.trim();

  if (!configuredUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const mongoUrl = new URL(configuredUri);
  if (!mongoUrl.pathname || mongoUrl.pathname === "/") {
    mongoUrl.pathname = `/${DB_NAME}`;
  }

  return mongoUrl.toString();
}

function connectDB() {
  if (mongoose.connection?.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (mongoose.connection?.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(getMongoUri())
      .then((connectionResponse) => {
        logger.info("MongoDB connected", {
          host: connectionResponse.connection.host,
          database: connectionResponse.connection.name,
        });

        return connectionResponse;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

export default connectDB;
