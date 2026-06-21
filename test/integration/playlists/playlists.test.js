import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { Playlist } from "../../../src/models/playlist.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import {
  authHeader,
  createPlaylist,
  createUser,
  createVideo,
} from "../../helpers/factories.js";

useTestDatabase();

describe("playlist APIs", () => {
  it("creates and fetches a playlist", async () => {
    const owner = await createUser();

    const created = await request(app)
      .post("/api/v1/playlist")
      .set("Authorization", authHeader(owner))
      .send({ name: "Favorites", description: "Favorite videos" })
      .expect(201);

    expect(created.body.data).toMatchObject({
      name: "Favorites",
      owner: owner._id.toString(),
    });

    const response = await request(app)
      .get(`/api/v1/playlist/${created.body.data._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(response.body.data.name).toBe("Favorites");
  });

  it("rejects incomplete playlist input", async () => {
    const owner = await createUser();

    await request(app)
      .post("/api/v1/playlist")
      .set("Authorization", authHeader(owner))
      .send({ name: "Missing description" })
      .expect(400);
  });

  it("returns a user's playlists, including an empty list", async () => {
    const owner = await createUser();

    const empty = await request(app)
      .get(`/api/v1/playlist/user/${owner._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(empty.body.data).toEqual([]);

    await createPlaylist(owner);
    const populated = await request(app)
      .get(`/api/v1/playlist/user/${owner._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(populated.body.data).toHaveLength(1);
  });

  it("adds and removes a video", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);
    const playlist = await createPlaylist(owner);

    const added = await request(app)
      .patch(`/api/v1/playlist/add/${video._id}/${playlist._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(added.body.data.videos).toContain(video._id.toString());

    await request(app)
      .patch(`/api/v1/playlist/add/${video._id}/${playlist._id}`)
      .set("Authorization", authHeader(owner))
      .expect(409);

    const removed = await request(app)
      .patch(`/api/v1/playlist/remove/${video._id}/${playlist._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(removed.body.data.videos).not.toContain(video._id.toString());
  });

  it("updates an owner's playlist", async () => {
    const owner = await createUser();
    const playlist = await createPlaylist(owner);

    const response = await request(app)
      .patch(`/api/v1/playlist/${playlist._id}`)
      .set("Authorization", authHeader(owner))
      .send({ newName: "Updated", newDescription: "Updated description" })
      .expect(200);

    expect(response.body.data).toMatchObject({
      name: "Updated",
      description: "Updated description",
    });
  });

  it("forbids non-owners from mutating a playlist", async () => {
    const owner = await createUser();
    const attacker = await createUser();
    const video = await createVideo(owner);
    const playlist = await createPlaylist(owner);

    await request(app)
      .patch(`/api/v1/playlist/add/${video._id}/${playlist._id}`)
      .set("Authorization", authHeader(attacker))
      .expect(403);

    await request(app)
      .patch(`/api/v1/playlist/${playlist._id}`)
      .set("Authorization", authHeader(attacker))
      .send({ newName: "Hijacked", newDescription: "Hijacked" })
      .expect(403);

    await request(app)
      .delete(`/api/v1/playlist/${playlist._id}`)
      .set("Authorization", authHeader(attacker))
      .expect(403);
  });

  it("deletes an owner's playlist", async () => {
    const owner = await createUser();
    const playlist = await createPlaylist(owner);

    await request(app)
      .delete(`/api/v1/playlist/${playlist._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);

    expect(await Playlist.findById(playlist._id)).toBeNull();
  });
});
