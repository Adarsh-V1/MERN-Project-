import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { Subscription } from "../../../src/models/subscription.model.js";
import { User } from "../../../src/models/user.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import { authHeader, createUser } from "../../helpers/factories.js";

useTestDatabase();

describe("subscription APIs", () => {
  it("subscribes and unsubscribes from a channel", async () => {
    const subscriber = await createUser();
    const channel = await createUser();

    const subscribed = await request(app)
      .post(`/api/v1/subscriptions/c/${channel._id}`)
      .set("Authorization", authHeader(subscriber))
      .expect(200);
    expect(subscribed.body.message).toContain("Subscribed");
    expect(await Subscription.countDocuments()).toBe(1);

    const unsubscribed = await request(app)
      .post(`/api/v1/subscriptions/c/${channel._id}`)
      .set("Authorization", authHeader(subscriber))
      .expect(200);
    expect(unsubscribed.body.message).toContain("Unsubscribed");
    expect(await Subscription.countDocuments()).toBe(0);
  });

  it("rejects self-subscription and missing channels", async () => {
    const user = await createUser();

    await request(app)
      .post(`/api/v1/subscriptions/c/${user._id}`)
      .set("Authorization", authHeader(user))
      .expect(400);

    await request(app)
      .post(`/api/v1/subscriptions/c/${new User()._id}`)
      .set("Authorization", authHeader(user))
      .expect(404);
  });

  it("lists channel subscribers without exposing secrets", async () => {
    const subscriber = await createUser();
    const channel = await createUser();
    await Subscription.create({
      subscriber: subscriber._id,
      channel: channel._id,
    });

    const response = await request(app)
      .get(`/api/v1/subscriptions/c/${channel._id}`)
      .set("Authorization", authHeader(channel))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].subscriber).not.toHaveProperty("password");
  });

  it("lists channels followed by a subscriber", async () => {
    const subscriber = await createUser();
    const channel = await createUser();
    await Subscription.create({
      subscriber: subscriber._id,
      channel: channel._id,
    });

    const response = await request(app)
      .get(`/api/v1/subscriptions/u/${subscriber._id}`)
      .set("Authorization", authHeader(subscriber))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].channel._id).toBe(channel._id.toString());
    expect(response.body.data[0].channel).not.toHaveProperty("password");
  });
});
