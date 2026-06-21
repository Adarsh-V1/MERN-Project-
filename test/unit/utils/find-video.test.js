import { describe, expect, it } from "vitest";

import { helperFindVideoId } from "../../../src/utils/FindVideoById.js";
import { Video } from "../../../src/models/video.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import { createUser, createVideo } from "../../helpers/factories.js";

useTestDatabase();

describe("helperFindVideoId", () => {
  it("returns a populated video without owner secrets", async () => {
    const owner = await createUser();
    const video = await createVideo(owner);

    const result = await helperFindVideoId(video._id.toString());

    expect(result._id.toString()).toBe(video._id.toString());
    expect(result.owner.username).toBe(owner.username);
    expect(result.owner.password).toBeUndefined();
  });

  it("rejects invalid and missing video IDs", async () => {
    await expect(helperFindVideoId("invalid")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid Video Id",
    });

    await expect(helperFindVideoId(new Video()._id.toString())).rejects.toMatchObject({
      statusCode: 400,
      message: "No video Exists",
    });
  });
});
