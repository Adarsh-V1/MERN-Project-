import { getRedisClient } from "../db/redis.js";
import { logger } from "../utils/logger.js";

function getReadyRedisClient() {
  const client = getRedisClient();

  if (!client?.isReady) {
    return null;
  }

  return client;
}

async function getCachedJson(key) {
  const client = getReadyRedisClient();

  if (!client) {
    return null;
  }

  try {
    const cachedValue = await client.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    logger.warn("Redis cache read failed", {
      key,
      error: error.message,
    });

    return null;
  }
}

async function setCachedJson(key, value, ttlSeconds) {
  const client = getReadyRedisClient();

  if (!client) {
    return false;
  }

  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });

    return true;
  } catch (error) {
    logger.warn("Redis cache write failed", {
      key,
      error: error.message,
    });

    return false;
  }
}

async function deleteCacheByPrefixes(prefixes) {
  const client = getReadyRedisClient();

  if (!client) {
    return 0;
  }

  let deletedCount = 0;

  for (const prefix of prefixes) {
    try {
      for await (const keys of client.scanIterator({
        MATCH: `${prefix}*`,
        COUNT: 100,
      })) {
        if (!keys.length) {
          continue;
        }

        deletedCount += await client.del(keys);
      }
    } catch (error) {
      logger.warn("Redis cache invalidation failed", {
        prefix,
        error: error.message,
      });
    }
  }

  return deletedCount;
}

export { deleteCacheByPrefixes, getCachedJson, setCachedJson };
