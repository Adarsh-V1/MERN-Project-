import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  updateTakes,
  createTakes,
  getUserTakes,
  deleteTakes,
  rateCapTake,
  rateMidTake,
  rateFactsTake,
  getAllTakes,
} from "../controllers/hotTake.controller.js";

const hotTakeRouter = Router();

hotTakeRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/takes:
 *   post:
 *     summary: Create a new hot take
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hot take created successfully
 */
hotTakeRouter.route("/").post(createTakes);

/**
 * @swagger
 * /api/v1/takes/rate/cap/{takeId}:
 *   post:
 *     summary: Rate a hot take as cap
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: takeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cap rating submitted
 */
hotTakeRouter.post("/rate/cap/:takeId", rateCapTake);

/**
 * @swagger
 * /api/v1/takes/rate/mid/{takeId}:
 *   post:
 *     summary: Rate a hot take as mid
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: takeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mid rating submitted
 */
hotTakeRouter.post("/rate/mid/:takeId", rateMidTake);

/**
 * @swagger
 * /api/v1/takes/rate/facts/{takeId}:
 *   post:
 *     summary: Rate a hot take as facts
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: takeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facts rating submitted
 */
hotTakeRouter.post("/rate/facts/:takeId", rateFactsTake);

/**
 * @swagger
 * /api/v1/takes/user/{userId}:
 *   get:
 *     summary: Get hot takes for a user
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User hot takes fetched successfully
 */
hotTakeRouter.route("/user/:userId").get(getUserTakes);

/**
 * @swagger
 * /api/v1/takes/all:
 *   get:
 *     summary: Get all hot takes
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hot takes fetched successfully
 */
hotTakeRouter.route("/all").get(getAllTakes);

/**
 * @swagger
 * /api/v1/takes/{takeId}:
 *   patch:
 *     summary: Update a hot take
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: takeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hot take updated successfully
 *   delete:
 *     summary: Delete a hot take
 *     tags: [Hot Takes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: takeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hot take deleted successfully
 */
hotTakeRouter.route("/:takeId").patch(updateTakes).delete(deleteTakes);

export { hotTakeRouter };
