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
import { Video } from "../../../src/models/video.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

const uploadNames = [
  "test-video.mp4",
  "test-thumbnail.jpg",
  "updated-thumbnail.jpg",
];

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  await Promise.all(
    uploadNames.map((name) =>
      fs.rm(path.join(process.cwd(), "public", "temp", name), { force: true })
    )
  );
});

describe("video APIs", () => {
  it("lists all videos publicly", async () => {
    const owner = await createUser();
    await createVideo(owner, { title: "Public video" });

    const response = await request(app).get("/api/v1/videos/all").expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Public video");
  });

  it("lists the authenticated user's videos by default", async () => {
    const owner = await createUser();
    const otherUser = await createUser();
    await createVideo(owner, { title: "Mine" });
    await createVideo(otherUser, { title: "Not mine" });

    const response = await request(app)
      .get("/api/v1/videos")
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Mine");
  });

  it("publishes a video using mocked Cloudinary uploads", async () => {
    const owner = await createUser();
    uploadOnCloudinary
      .mockResolvedValueOnce({ url: "https://cdn.example.com/thumbnail.jpg" })
      .mockResolvedValueOnce({
        url: "https://cdn.example.com/video.mp4",
        duration: 90,
      });

    const response = await request(app)
      .post("/api/v1/videos")
      .set("Authorization", authHeader(owner))
      .field("title", "Uploaded video")
      .field("description", "Uploaded description")
      .attach("videoFile", Buffer.from("fake-video"), "test-video.mp4")
      .attach("thumbnail", Buffer.from("fake-thumbnail"), "test-thumbnail.jpg")
      .expect(200);

    expect(response.body.data).toMatchObject({
      title: "Uploaded video",
      owner: owner._id.toString(),
      duration: 90,
    });
    expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
  });

  it("rejects publishing without both files", async () => {
    const owner = await createUser();

    await request(app)
      .post("/api/v1/videos")
      .set("Authorization", authHeader(owner))
      .field("title", "Missing files")
      .field("description", "No uploads")
      .expect(400);
  });

  it("increments a view only once per user and adds watch history", async () => {
    const owner = await createUser();
    const viewer = await createUser();
    const video = await createVideo(owner);

    await request(app)
      .get(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);
    await request(app)
      .get(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);

    const storedVideo = await Video.findById(video._id);
    const storedViewer = await User.findById(viewer._id);
    expect(storedVideo.views).toBe(1);
    expect(storedVideo.viewedBy.map(String)).toContain(viewer._id.toString());
    expect(storedViewer.watchHistory.map(String)).toContain(
      video._id.toString()
    );
  });

  it("lets an owner update a video", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);
    uploadOnCloudinary.mockResolvedValue({
      url: "https://cdn.example.com/updated-thumbnail.jpg",
    });

    const response = await request(app)
      .patch(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(owner))
      .field("newTitle", "Updated title")
      .field("newDescription", "Updated description")
      .attach(
        "updatedThumbnail",
        Buffer.from("updated-thumbnail"),
        "updated-thumbnail.jpg"
      )
      .expect(200);

    expect(response.body.data).toMatchObject({
      title: "Updated title",
      description: "Updated description",
      thumbnail: "https://cdn.example.com/updated-thumbnail.jpg",
    });
  });

  it("forbids a non-owner from updating a video", async () => {
    const owner = await createUser();
    const attacker = await createUser();
    const video = await createVideo(owner);

    await request(app)
      .patch(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(attacker))
      .field("newTitle", "Hijacked")
      .field("newDescription", "Hijacked")
      .attach(
        "updatedThumbnail",
        Buffer.from("updated-thumbnail"),
        "updated-thumbnail.jpg"
      )
      .expect(403);
  });

  it("toggles publish status for the owner", async () => {
    const owner = await createUser();
    const video = await createVideo(owner, { isPublished: true });

    const response = await request(app)
      .patch(`/api/v1/videos/toggle/publish/${video._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toBe(false);
    expect((await Video.findById(video._id)).isPublished).toBe(false);
  });

  it("deletes an owner's video and forbids non-owners", async () => {
    const owner = await createUser();
    const attacker = await createUser();
    const video = await createVideo(owner);

    await request(app)
      .delete(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(attacker))
      .expect(403);

    await request(app)
      .delete(`/api/v1/videos/${video._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(await Video.findById(video._id)).toBeNull();
  });
});
