import { logger } from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.once("finish", () => {
    const finishedAt = process.hrtime.bigint();

    const durationMs = Number(
      (Number(finishedAt - startedAt) / 1_000_000).toFixed(2)
    );

    const metadata = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error("HTTP request completed", metadata);
    } else if (res.statusCode >= 400) {
      logger.warn("HTTP request completed", metadata);
    } else {
      logger.info("HTTP request completed", metadata);
    }
  });

  next();
};

export { requestLogger };