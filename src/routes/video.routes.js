import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideosOfUser,
  getVideoById,
  publishVideo,
  showAllVideos,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

/**
 * @swagger
 * /api/v1/videos/all:
 *   get:
 *     summary: Get all public videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Videos fetched successfully
 */
videoRouter.route("/all").get(showAllVideos);
videoRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/videos:
 *   get:
 *     summary: Get videos for the authenticated user
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User videos fetched successfully
 *   post:
 *     summary: Publish a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - videoFile
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               videoFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 */
videoRouter
  .route("/")
  .get(getAllVideosOfUser)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishVideo
  );

/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   get:
 *     summary: Get a video by id
 *     tags: [Videos]
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
 *         description: Video fetched successfully
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
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
 *         description: Video deleted successfully
 *   patch:
 *     summary: Update a video's title, description, and thumbnail
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *               newDescription:
 *                 type: string
 *               updatedThumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video updated successfully
 */
videoRouter
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("updatedThumbnail"), updateVideo);

/**
 * @swagger
 * /api/v1/videos/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle a video's publish status
 *     tags: [Videos]
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
 *         description: Publish status updated successfully
 */
videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export { videoRouter };
