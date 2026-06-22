import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlayList,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT);

/**
 * @swagger
 * /api/v1/playlist:
 *   post:
 *     summary: Create a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Playlist created successfully
 */
playlistRouter.route("/").post(createPlaylist);

/**
 * @swagger
 * /api/v1/playlist/{playlistId}:
 *   get:
 *     summary: Get a playlist by id
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist found
 *   patch:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 */
playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlayList);

/**
 * @swagger
 * /api/v1/playlist/add/{videoId}/{playlistId}:
 *   patch:
 *     summary: Add a video to a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video added to playlist
 */
playlistRouter.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

/**
 * @swagger
 * /api/v1/playlist/remove/{videoId}/{playlistId}:
 *   patch:
 *     summary: Remove a video from a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video removed from playlist
 */
playlistRouter
  .route("/remove/:videoId/:playlistId")
  .patch(removeVideoFromPlaylist);

/**
 * @swagger
 * /api/v1/playlist/user/{userId}:
 *   get:
 *     summary: Get playlists for a specific user
 *     tags: [Playlists]
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
 *         description: User playlists fetched successfully
 */
playlistRouter.route("/user/:userId").get(getUserPlaylists);

export { playlistRouter };
