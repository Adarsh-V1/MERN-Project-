import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../../../src/utils/cloudinary.js", () => ({
  uploadOnCloudinary: vi.fn(),
}));

import app from "../../../src/app.js";
import { uploadOnCloudinary } from "../../../src/utils/cloudinary.js";
import { User } from "../../../src/models/user.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createSubscription,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

const tempFiles = ["test-avatar.png", "test-cover.png"].map((file) =>
  path.join(process.cwd(), "public", "temp", file)
);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  await Promise.all(tempFiles.map((file) => fs.rm(file, { force: true })));
});

describe("user profile APIs", () => {
  it("updates account details", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch("/api/v1/users/update-account")
      .set("Authorization", authHeader(user))
      .send({ fullName: "Updated Name", email: "updated@example.com" })
      .expect(200);

    expect(response.body.data).toMatchObject({
      fullName: "Updated Name",
      email: "updated@example.com",
    });
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).not.toHaveProperty("refreshToken");
  });

  it("rejects an invalid account email", async () => {
    const user = await createUser();

    await request(app)
      .patch("/api/v1/users/update-account")
      .set("Authorization", authHeader(user))
      .send({ email: "invalid-email" })
      .expect(400);
  });

  it("returns channel subscription information", async () => {
    const viewer = await createUser();
    const channel = await createUser({ username: "channel_owner" });
    await createSubscription(viewer, channel);

    const response = await request(app)
      .get(`/api/v1/users/c/${channel.username}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);

    expect(response.body.data).toMatchObject({
      username: "channel_owner",
      fullName: channel.fullName,
      subscribersCount: 1,
      isSubcribed: true,
    });
  });

  it("returns the authenticated user's watch history", async () => {
    const user = await createUser();
    const video = await createVideo(user);
    await User.findByIdAndUpdate(user._id, { $push: { watchHistory: video._id } });

    const response = await request(app)
      .get("/api/v1/users/watch-history")
      .set("Authorization", authHeader(user))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]._id).toBe(video._id.toString());
    expect(response.body.data[0].owner.username).toBe(user.username);
    expect(response.body.data[0].owner).not.toHaveProperty("password");
  });

  it("updates the avatar through the upload pipeline", async () => {
    const user = await createUser();
    uploadOnCloudinary.mockResolvedValue({ url: "https://cdn.example.com/avatar.png" });

    const response = await request(app)
      .patch("/api/v1/users/update-avatar")
      .set("Authorization", authHeader(user))
      .attach("avatar", Buffer.from("fake-avatar"), "test-avatar.png")
      .expect(200);

    expect(response.body.data.avatar).toBe("https://cdn.example.com/avatar.png");
    expect(uploadOnCloudinary).toHaveBeenCalledOnce();
  });

  it("updates the cover image through the upload pipeline", async () => {
    const user = await createUser();
    uploadOnCloudinary.mockResolvedValue({ url: "https://cdn.example.com/cover.png" });

    const response = await request(app)
      .patch("/api/v1/users/update-coverImage")
      .set("Authorization", authHeader(user))
      .attach("coverImage", Buffer.from("fake-cover"), "test-cover.png")
      .expect(200);

    expect(response.body.data.coverImage).toBe("https://cdn.example.com/cover.png");
  });

  it("requires an avatar file", async () => {
    const user = await createUser();

    await request(app)
      .patch("/api/v1/users/update-avatar")
      .set("Authorization", authHeader(user))
      .expect(400);
  });
});
