import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { requestLogger } from "../../../src/middlewares/logger.middleware.js";
import { logger } from "../../../src/utils/logger.js";

function runMiddleware(statusCode) {
  const req = { method: "GET", originalUrl: "/test", ip: "127.0.0.1" };
  const res = new EventEmitter();
  res.statusCode = statusCode;
  const next = vi.fn();

  requestLogger(req, res, next);
  res.emit("finish");

  return next;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requestLogger", () => {
  it.each([
    [200, "info"],
    [404, "warn"],
    [500, "error"],
  ])("logs status %s at %s level", (statusCode, level) => {
    const next = runMiddleware(statusCode);

    expect(next).toHaveBeenCalledOnce();
    expect(logger[level]).toHaveBeenCalledWith(
      "HTTP request completed",
      expect.objectContaining({ statusCode, method: "GET", path: "/test" })
    );
  });
});
