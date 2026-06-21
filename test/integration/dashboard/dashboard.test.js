import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createComment,
  createHotTake,
  createPlaylist,
  createSubscription,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

describe("dashboard APIs", () => {
  it("calculates channel statistics from persisted data", async () => {
    const owner = await createUser();
    const subscriber = await createUser();
    const videoOne = await createVideo(owner, { views: 10, likesCount: 3 });
    await createVideo(owner, { views: 20, likesCount: 5, title: "Most viewed" });
    await createComment(subscriber, videoOne);
    await createPlaylist(owner);
    await createHotTake(owner);
    await createSubscription(subscriber, owner);

    const response = await request(app)
      .get("/api/v1/dashboard/channel-stats")
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toMatchObject({
      totalVideos: 2,
      totalViews: 30,
      totalLikes: 8,
      totalComments: 1,
      totalSubscribers: 1,
      totalPlaylists: 1,
      totalHotTakes: 1,
      avgViews: 15,
      avgLikes: 4,
    });
    expect(response.body.data.mostViewedVideo.title).toBe("Most viewed");
  });

  it("returns channel videos without leaking owner secrets", async () => {
    const owner = await createUser();
    await createVideo(owner);

    const response = await request(app)
      .get("/api/v1/dashboard/channel-videos")
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].owner).not.toHaveProperty("password");
  });

  it("returns the channel's HotTakes", async () => {
    const owner = await createUser();
    await createHotTake(owner);

    const response = await request(app)
      .get("/api/v1/dashboard/channel-takes")
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].owner).not.toHaveProperty("password");
  });
});
