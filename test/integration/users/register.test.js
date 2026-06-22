import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../../src/app.js";
import { User } from "../../../src/models/user.model.js";
import { useTestDatabase } from "../../helpers/database.js";

useTestDatabase();

describe("POST /api/v1/users/register", () => {
  const validUser = {
    fullName: "Ada Lovelace",
    username: "Ada_Lovelace",
    email: "ada@example.com",
    password: "StrongPassword123",
  };

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send(validUser)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toMatchObject({
      statusCode: 201,
      success: true,
      message: "User Registered Successfully!",
      data: {
        fullName: "Ada Lovelace",
        username: "ada_lovelace",
        email: "ada@example.com",
      },
    });

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).not.toHaveProperty("refreshToken");
  });

  it("stores a hashed password in MongoDB", async () => {
    await request(app)
      .post("/api/v1/users/register")
      .send(validUser)
      .expect(201);

    const savedUser = await User.findOne({
      email: validUser.email,
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser.password).not.toBe(validUser.password);

    const passwordIsValid = await savedUser.isPasswordCorrect(
      validUser.password
    );

    expect(passwordIsValid).toBe(true);
  });

  it("rejects missing required fields", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        email: "ada@example.com",
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message:
        "Provide either fullName or username; email and password are required",
    });

    expect(await User.countDocuments()).toBe(0);
  });

  it("rejects an invalid email address", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        ...validUser,
        email: "not-an-email",
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: "Invalid email format!",
    });

    expect(await User.countDocuments()).toBe(0);
  });

  it("rejects duplicate email registration", async () => {
    await request(app)
      .post("/api/v1/users/register")
      .send(validUser)
      .expect(201);

    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        ...validUser,
        username: "different_username",
      })
      .expect(409);

    expect(response.body).toMatchObject({
      success: false,
      message: "Email Already Exists !",
    });

    expect(await User.countDocuments()).toBe(1);
  });

  it("rejects a duplicate username", async () => {
    await request(app)
      .post("/api/v1/users/register")
      .send(validUser)
      .expect(201);

    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        ...validUser,
        email: "different@example.com",
      })
      .expect(409);

    expect(response.body).toMatchObject({
      success: false,
      message: "Username is not availble !",
    });

    expect(await User.countDocuments()).toBe(1);
  });
});
