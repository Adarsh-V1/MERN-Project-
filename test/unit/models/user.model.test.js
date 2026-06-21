import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { User } from "../../../src/models/user.model.js";
import { useTestDatabase } from "../../helpers/database.js";
import { createUser } from "../../helpers/factories.js";

useTestDatabase();

describe("User model", () => {
  it("hashes passwords and verifies them", async () => {
    const user = await createUser();

    expect(user.password).not.toBe("Password@123");
    expect(await user.isPasswordCorrect("Password@123")).toBe(true);
    expect(await user.isPasswordCorrect("wrong-password")).toBe(false);
  });

  it("does not rehash a password when unrelated fields change", async () => {
    const user = await createUser();
    const originalHash = user.password;

    user.fullName = "Changed Name";
    await user.save();

    expect(user.password).toBe(originalHash);
  });

  it("generates verifiable access and refresh tokens", async () => {
    const user = await createUser();

    const accessPayload = jwt.verify(
      user.generateAccessToken(),
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshPayload = jwt.verify(
      user.generateRefreshToken(),
      process.env.REFRESH_TOKEN_SECRET
    );

    expect(accessPayload).toMatchObject({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
    });
    expect(refreshPayload._id).toBe(user._id.toString());
  });

  it("enforces unique email addresses", async () => {
    await User.init();
    await createUser({ email: "unique@example.com" });

    await expect(
      createUser({ email: "unique@example.com", username: "another_username" })
    ).rejects.toMatchObject({ code: 11000 });
  });
});
