import { createClient } from "redis";
import { logger } from "../utils/logger.js";

let redisClient;
let redisConnectionPromise;
let listenersRegistered = false;
const REDIS_ENABLED = false;

function getRedisUrl() {
  return process.env.REDIS_URL?.trim() || "";
}

function isRedisConfigured() {
  return REDIS_ENABLED && Boolean(getRedisUrl());
}

function getRedisClient() {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: getRedisUrl(),
    });
  }

  if (!listenersRegistered) {
    redisClient.on("error", (error) => {
      logger.error("Redis client error", {
        error: error.message,
        stack: error.stack,
      });
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    redisClient.on("connect", () => {
      logger.info("Redis Socket Connected");
    });

    redisClient.on("ready", () => {
      logger.info("Redis Client Ready");
    });

    listenersRegistered = true;
  }

  return redisClient;
}

async function connectRedis() {
  if (!isRedisConfigured()) {
    logger.warn("Redis is disabled because REDIS_URL is not configured");
    return null;
  }

  const client = getRedisClient();

  if (client.isReady) {
    return client;
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = client.connect().catch((error) => {
      redisConnectionPromise = undefined;
      throw error;
    });
  }

  await redisConnectionPromise;
  return client;
}

export { connectRedis, getRedisClient, isRedisConfigured };
