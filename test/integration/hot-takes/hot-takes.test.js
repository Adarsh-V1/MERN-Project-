import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { HotTake } from "../../../src/models/hotTake.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import { authHeader, createHotTake, createUser } from "../../helpers/factories.js";

useTestDatabase();

describe("HotTake APIs", () => {
  it("creates, lists, and fetches a user's HotTakes", async () => {
    const owner = await createUser();

    const created = await request(app)
      .post("/api/v1/takes")
      .set("Authorization", authHeader(owner))
      .send({ content: "A brand new take" })
      .expect(201);
    expect(created.body.data.content).toBe("A brand new take");

    const all = await request(app)
      .get("/api/v1/takes/all")
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(all.body.data).toHaveLength(1);
    expect(all.body.data[0].owner).not.toHaveProperty("password");

    const userTakes = await request(app)
      .get(`/api/v1/takes/user/${owner._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(userTakes.body.data).toHaveLength(1);
  });

  it("rejects empty content", async () => {
    const owner = await createUser();

    await request(app)
      .post("/api/v1/takes")
      .set("Authorization", authHeader(owner))
      .send({ content: "  " })
      .expect(400);
  });

  it("updates and deletes an owner's HotTake", async () => {
    const owner = await createUser();
    const hotTake = await createHotTake(owner);

    const updated = await request(app)
      .patch(`/api/v1/takes/${hotTake._id}`)
      .set("Authorization", authHeader(owner))
      .send({ newContent: "Updated take" })
      .expect(200);
    expect(updated.body.data.content).toBe("Updated take");

    await request(app)
      .delete(`/api/v1/takes/${hotTake._id}`)
      .set("Authorization", authHeader(owner))
      .expect(200);
    expect(await HotTake.findById(hotTake._id)).toBeNull();
  });

  it("forbids non-owner updates and deletes", async () => {
    const owner = await createUser();
    const attacker = await createUser();
    const hotTake = await createHotTake(owner);

    await request(app)
      .patch(`/api/v1/takes/${hotTake._id}`)
      .set("Authorization", authHeader(attacker))
      .send({ newContent: "Hijacked" })
      .expect(403);
    await request(app)
      .delete(`/api/v1/takes/${hotTake._id}`)
      .set("Authorization", authHeader(attacker))
      .expect(403);
  });

  it("moves a user's rating between cap, mid, and facts", async () => {
    const owner = await createUser();
    const voter = await createUser();
    const hotTake = await createHotTake(owner);

    const cap = await request(app)
      .post(`/api/v1/takes/rate/cap/${hotTake._id}`)
      .set("Authorization", authHeader(voter))
      .expect(200);
    expect(cap.body.data.cap).toContain(voter._id.toString());

    const mid = await request(app)
      .post(`/api/v1/takes/rate/mid/${hotTake._id}`)
      .set("Authorization", authHeader(voter))
      .expect(200);
    expect(mid.body.data.cap).not.toContain(voter._id.toString());
    expect(mid.body.data.mid).toContain(voter._id.toString());

    const facts = await request(app)
      .post(`/api/v1/takes/rate/facts/${hotTake._id}`)
      .set("Authorization", authHeader(voter))
      .expect(200);
    expect(facts.body.data.mid).not.toContain(voter._id.toString());
    expect(facts.body.data.facts).toContain(voter._id.toString());
  });
});
