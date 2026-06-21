import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { Comment } from "../../../src/models/comment.model.js";
import { Like } from "../../../src/models/like.model.js";
import { Video } from "../../../src/models/video.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createComment,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

describe("like APIs", () => {
  it("toggles a video like and keeps the counter synchronized", async () => {
    const owner = await createUser();
    const viewer = await createUser();
    const video = await createVideo(owner);

    const liked = await request(app)
      .post(`/api/v1/likes/toggle/v/${video._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);
    expect(liked.body.data.likesCount).toBe(1);
    expect(await Like.countDocuments({ video: video._id })).toBe(1);

    const unliked = await request(app)
      .post(`/api/v1/likes/toggle/v/${video._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);
    expect(unliked.body.data.likesCount).toBe(0);
    expect(await Like.countDocuments({ video: video._id })).toBe(0);
  });

  it("toggles a comment like and keeps the counter synchronized", async () => {
    const owner = await createUser();
    const viewer = await createUser();
    const video = await createVideo(owner);
    const comment = await createComment(owner, video);

    const liked = await request(app)
      .post(`/api/v1/likes/toggle/c/${comment._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);
    expect(liked.body.data.likesCount).toBe(1);

    await request(app)
      .post(`/api/v1/likes/toggle/c/${comment._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);
    expect((await Comment.findById(comment._id)).likesCount).toBe(0);
  });

  it("returns the authenticated user's liked videos", async () => {
    const owner = await createUser();
    const viewer = await createUser();
    const video = await createVideo(owner);

    await request(app)
      .post(`/api/v1/likes/toggle/v/${video._id}`)
      .set("Authorization", authHeader(viewer))
      .expect(200);

    const response = await request(app)
      .get("/api/v1/likes/likedVideos")
      .set("Authorization", authHeader(viewer))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].video._id).toBe(video._id.toString());
  });

  it("does not create orphan likes for missing targets", async () => {
    const user = await createUser();

    await request(app)
      .post(`/api/v1/likes/toggle/v/${new Video()._id}`)
      .set("Authorization", authHeader(user))
      .expect(404);
    await request(app)
      .post(`/api/v1/likes/toggle/c/${new Comment()._id}`)
      .set("Authorization", authHeader(user))
      .expect(404);

    expect(await Like.countDocuments()).toBe(0);
  });
});
