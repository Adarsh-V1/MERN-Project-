import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/likes/toggle/v/{videoId}:
 *   post:
 *     summary: Toggle like on a video
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video like state changed
 */
likeRouter.route("/toggle/v/:videoId").post(toggleVideoLike);

/**
 * @swagger
 * /api/v1/likes/toggle/c/{commentId}:
 *   post:
 *     summary: Toggle like on a comment
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment like state changed
 */
likeRouter.route("/toggle/c/:commentId").post(toggleCommentLike);

/**
 * @swagger
 * /api/v1/likes/likedVideos:
 *   get:
 *     summary: Get videos liked by the authenticated user
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liked videos fetched successfully
 */
likeRouter.route("/likedVideos").get(getLikedVideos);

export { likeRouter };
