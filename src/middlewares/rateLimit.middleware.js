import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient } from "../db/redis.js";

const redisClient = getRedisClient();
const isTestEnvironment = process.env.NODE_ENV === "test";

const authLimiterOptions = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
};

if (redisClient) {
  authLimiterOptions.store = new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:auth:",
  });
}

const authLimiter = isTestEnvironment
  ? (req, res, next) => next()
  : rateLimit(authLimiterOptions);

export { authLimiter };
