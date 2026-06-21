import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("mongoose", () => ({
  default: {
    connect: vi.fn(),
  },
}));

vi.mock("../../../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
  },
}));

import mongoose from "mongoose";
import { DB_NAME } from "../../../src/constant.js";
import connectDB from "../../../src/db/db_index.js";
import { logger } from "../../../src/utils/logger.js";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.MONGODB_URI = "mongodb://localhost:27017";
});

describe("connectDB", () => {
  it("connects to the configured database and logs safe metadata", async () => {
    const connectionResponse = {
      connection: {
        host: "localhost",
        name: DB_NAME,
      },
    };
    mongoose.connect.mockResolvedValue(connectionResponse);

    await expect(connectDB()).resolves.toBe(connectionResponse);

    expect(mongoose.connect).toHaveBeenCalledWith(
      `mongodb://localhost:27017/${DB_NAME}`
    );
    expect(logger.info).toHaveBeenCalledWith("MongoDB connected", {
      host: "localhost",
      database: DB_NAME,
    });
  });

  it("propagates connection failures", async () => {
    mongoose.connect.mockRejectedValue(new Error("connection failed"));

    await expect(connectDB()).rejects.toThrow("connection failed");
  });
});
