import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { Comment } from "../../../src/models/comment.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createComment,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

describe("comment APIs", () => {
  it("adds and lists comments without leaking owner secrets", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);

    const created = await request(app)
      .post(`/api/v1/comments/${video._id}`)
      .set("Authorization", authHeader(owner))
      .send({ content: "New comment" })
      .expect(200);

    expect(created.body.data.content).toBe("New comment");

    const response = await request(app)
      .get(`/api/v1/comments/${video._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].owner).not.toHaveProperty("password");
    expect(response.body.data[0].owner).not.toHaveProperty("refreshToken");
  });

  it("rejects empty comment content", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);

    await request(app)
      .post(`/api/v1/comments/${video._id}`)
      .set("Authorization", authHeader(owner))
      .send({ content: "   " })
      .expect(400);
  });

  it("rejects comments for a missing video", async () => {
    const owner = await createUser();
    const missingVideoId = new Comment()._id;

    await request(app)
      .post(`/api/v1/comments/${missingVideoId}`)
      .set("Authorization", authHeader(owner))
      .send({ content: "Cannot be added" })
      .expect(404);
  });

  it("lets the owner update a comment", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);
    const comment = await createComment(owner, video);

    const response = await request(app)
      .patch(`/api/v1/comments/c/${comment._id}`)
      .set("Authorization", authHeader(owner))
      .send({ newComment: "Updated comment" })
      .expect(200);

    expect(response.body.data.content).toBe("Updated comment");
  });

  it("forbids a non-owner from updating or deleting a comment", async () => {
    const owner = await createUser();
    const attacker = await createUser();
    const video = await createVideo(owner);
    const comment = await createComment(owner, video);

    await request(app)
      .patch(`/api/v1/comments/c/${comment._id}`)
      .set("Authorization", authHeader(attacker))
      .send({ newComment: "Hijacked" })
      .expect(403);

    await request(app)
      .delete(`/api/v1/comments/c/${comment._id}`)
      .set("Authorization", authHeader(attacker))
      .expect(403);
  });

  it("lets the owner delete a comment", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);
    const comment = await createComment(owner, video);

    await request(app)
      .delete(`/api/v1/comments/c/${comment._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(await Comment.findById(comment._id)).toBeNull();
  });
});
