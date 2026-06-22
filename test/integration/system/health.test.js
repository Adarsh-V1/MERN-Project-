import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { useTestDatabase } from "../../helpers/database.js";

useTestDatabase();

describe("GET /api/v1/users/okay", () => {
  it("returns a successful health response", async () => {
    const response = await request(app).get("/api/v1/users/okay").expect(200);

    expect(response.body).toBe("everything good in backend server");
  });
});

describe("API error responses", () => {
  it("returns JSON for unknown API routes", async () => {
    const response = await request(app)
      .get("/api/v1/does-not-exist")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toMatchObject({
      success: false,
      message: "Route not found: GET /api/v1/does-not-exist",
    });
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .set("Content-Type", "application/json")
      .send('{"email":')
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
