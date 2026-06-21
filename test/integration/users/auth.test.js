import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { User } from "../../../src/models/user.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import { authHeader, createUser } from "../../helpers/factories.js";

useTestDatabase();

describe("user authentication APIs", () => {
  it("logs in with valid credentials and returns safe user data", async () => {
    const user = await createUser({
      email: "login@example.com",
      username: "login_user",
    });

    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: user.email, password: "Password@123" })
      .expect(200);

    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("accessToken="),
        expect.stringContaining("refreshToken="),
      ])
    );

    const storedUser = await User.findById(user._id);
    expect(storedUser.refreshToken).toBe(response.body.data.refreshToken);
  });

  it("rejects login without a password", async () => {
    const user = await createUser();

    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: user.email })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("rejects an incorrect password", async () => {
    const user = await createUser();

    await request(app)
      .post("/api/v1/users/login")
      .send({ email: user.email, password: "WrongPassword" })
      .expect(404);
  });

  it("protects authenticated routes", async () => {
    await request(app).get("/api/v1/users/current-user").expect(401);
  });

  it("returns the authenticated user", async () => {
    const user = await createUser();

    const response = await request(app)
      .get("/api/v1/users/current-user")
      .set("Authorization", authHeader(user))
      .expect(200);

    expect(response.body.data.user._id).toBe(user._id.toString());
    expect(response.body.data.user).not.toHaveProperty("password");
  });

  it("refreshes access and refresh tokens", async () => {
    const user = await createUser();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const response = await request(app)
      .post("/api/v1/users/refresh-token")
      .send({ refreshToken })
      .expect(200);

    expect(response.body.data.newAccessToken).toEqual(expect.any(String));
    expect(response.body.data.newRefreshToken).toEqual(expect.any(String));
  });

  it("rejects an invalid refresh token", async () => {
    await request(app)
      .post("/api/v1/users/refresh-token")
      .send({ refreshToken: "not-a-token" })
      .expect(401);
  });

  it("changes the current password", async () => {
    const user = await createUser();

    await request(app)
      .post("/api/v1/users/change-password")
      .set("Authorization", authHeader(user))
      .send({ oldPassword: "Password@123", newPassword: "NewPassword@456" })
      .expect(200);

    const updatedUser = await User.findById(user._id);
    expect(await updatedUser.isPasswordCorrect("NewPassword@456")).toBe(true);
    expect(await updatedUser.isPasswordCorrect("Password@123")).toBe(false);
  });

  it("logs out and removes the stored refresh token", async () => {
    const user = await createUser({ refreshToken: "stored-token" });

    const response = await request(app)
      .post("/api/v1/users/logout")
      .set("Authorization", authHeader(user))
      .expect(200);

    expect(response.body.message).toBe("User Logged out Successfully");
    expect((await User.findById(user._id)).refreshToken).toBeUndefined();
  });
});
