import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    uploader: { upload: vi.fn() },
  },
}));

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../../../src/utils/cloudinary.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadOnCloudinary", () => {
  it("returns null without a local path", async () => {
    await expect(uploadOnCloudinary()).resolves.toBeNull();
    expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
  });

  it("uploads and removes the local file", async () => {
    const uploaded = {
      url: "https://cdn.example.com/file.jpg",
      public_id: "file-id",
      resource_type: "image",
    };
    cloudinary.uploader.upload.mockResolvedValue(uploaded);

    await expect(uploadOnCloudinary("/tmp/file.jpg")).resolves.toBe(uploaded);
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("/tmp/file.jpg", {
      resource_type: "auto",
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith("/tmp/file.jpg");
  });

  it("cleans up and returns null after an upload failure", async () => {
    cloudinary.uploader.upload.mockRejectedValue(new Error("upload failed"));
    fs.existsSync.mockReturnValue(true);

    await expect(uploadOnCloudinary("/tmp/file.jpg")).resolves.toBeNull();
    expect(fs.unlinkSync).toHaveBeenCalledWith("/tmp/file.jpg");
  });
});
