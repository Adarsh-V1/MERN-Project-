import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  okay,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Accepts multipart/form-data with optional avatar and cover image uploads.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Username or email already exists
 */
userRouter.route("/register").post(
  authLimiter,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

/**
 * @swagger
 * /api/v1/users/okay:
 *   get:
 *     summary: Health check for the user service
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Backend is healthy
 */
userRouter.route("/okay").get(okay);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing fields
 *       404:
 *         description: User not found or invalid password
 *       429:
 *         description: Too many requests
 */
userRouter.route("/login").post(authLimiter, loginUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/logout").post(verifyJWT, logoutUser);

/**
 * @swagger
 * /api/v1/users/refresh-token:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       401:
 *         description: Invalid refresh token
 *       429:
 *         description: Too many requests
 */
userRouter.route("/refresh-token").post(authLimiter, refreshAccessToken);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     summary: Change the current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

/**
 * @swagger
 * /api/v1/users/current-user:
 *   get:
 *     summary: Get the current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);

/**
 * @swagger
 * /api/v1/users/update-account:
 *   patch:
 *     summary: Update account details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);

/**
 * @swagger
 * /api/v1/users/update-avatar:
 *   patch:
 *     summary: Update the current user's avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       401:
 *         description: Unauthorized
 */
userRouter
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

/**
 * @swagger
 * /api/v1/users/update-coverImage:
 *   patch:
 *     summary: Update the current user's cover image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *       401:
 *         description: Unauthorized
 */
userRouter
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

/**
 * @swagger
 * /api/v1/users/c/{username}:
 *   get:
 *     summary: Get a user's channel profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 */
userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile);

/**
 * @swagger
 * /api/v1/users/watch-history:
 *   get:
 *     summary: Get the authenticated user's watch history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watch history fetched successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.route("/watch-history").get(verifyJWT, getWatchHistory);

export { userRouter };
