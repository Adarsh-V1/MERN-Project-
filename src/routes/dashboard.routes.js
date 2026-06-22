import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
  getChannelTakes,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/dashboard/channel-stats:
 *   get:
 *     summary: Get dashboard stats for the authenticated user's channel
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel stats fetched successfully
 */
dashboardRouter.route("/channel-stats").get(getChannelStats);

/**
 * @swagger
 * /api/v1/dashboard/channel-videos:
 *   get:
 *     summary: Get videos for the authenticated user's channel
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel videos fetched successfully
 */
dashboardRouter.route("/channel-videos").get(getChannelVideos);

/**
 * @swagger
 * /api/v1/dashboard/channel-takes:
 *   get:
 *     summary: Get hot takes for the authenticated user's channel
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel hot takes fetched successfully
 */
dashboardRouter.route("/channel-takes").get(getChannelTakes);

export { dashboardRouter };
