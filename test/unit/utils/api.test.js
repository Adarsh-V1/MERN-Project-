import { describe, expect, it, vi } from "vitest";

import { ApiError } from "../../../src/utils/ApiError.js";
import { ApiResponse } from "../../../src/utils/ApiResponse.js";
import { asyncHandler } from "../../../src/utils/asyncHandler.js";

describe("ApiError", () => {
  it("stores API error metadata and captures a stack", () => {
    const error = new ApiError(422, "Validation failed", ["email"]);

    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      statusCode: 422,
      message: "Validation failed",
      errors: ["email"],
      success: false,
      data: null,
    });
    expect(error.stack).toContain("Validation failed");
  });
});

describe("ApiResponse", () => {
  it("marks successful and unsuccessful status codes correctly", () => {
    expect(new ApiResponse(200, { ok: true }).success).toBe(true);
    expect(new ApiResponse(400, null).success).toBe(false);
  });
});

describe("asyncHandler", () => {
  it("forwards rejected promises to next", async () => {
    const error = new Error("async failure");
    const next = vi.fn();
    const wrapped = asyncHandler(async () => {
      throw error;
    });

    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("also forwards synchronous errors to next", async () => {
    const error = new Error("sync failure");
    const next = vi.fn();
    const wrapped = asyncHandler(() => {
      throw error;
    });

    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
