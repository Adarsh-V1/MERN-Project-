import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/subscriptions/c/{channelId}:
 *   get:
 *     summary: Get subscribers for a channel
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribers fetched successfully
 *   post:
 *     summary: Toggle a subscription for a channel
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription state changed successfully
 */
subscriptionRouter
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

/**
 * @swagger
 * /api/v1/subscriptions/u/{subscriberId}:
 *   get:
 *     summary: Get channels a user is subscribed to
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribed channels fetched successfully
 */
subscriptionRouter.route("/u/:subscriberId").get(getSubscribedChannels);

export { subscriptionRouter };
