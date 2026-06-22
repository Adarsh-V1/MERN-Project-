import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { getCachedJson, setCachedJson } from "../services/cache.service.js";
import { cacheKeys, cacheTtlSeconds } from "../utils/cacheKeys.js";
import { invalidatePlaylistCaches } from "../utils/cacheInvalidation.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!(name && description)) {
    throw new ApiError(400, "Please Provide Name and description");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    videos: [],
  });
  if (!playlist) {
    throw new ApiError(500, "Playlist wasn't created");
  }

  await invalidatePlaylistCaches({ ownerId: req.user._id.toString() });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist Created successfully !!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cacheKey = cacheKeys.userPlaylists(userId);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const playlist = await Playlist.find({ owner: userId });
  const response = new ApiResponse(200, playlist, "User Playlist Found!!");
  await setCachedJson(cacheKey, response, cacheTtlSeconds.playlists);
  return res.status(200).json(response);
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const cacheKey = cacheKeys.playlist(playlistId);
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "No Playlist found!");
  }

  const response = new ApiResponse(200, playlist, "Playlist Found");
  await setCachedJson(cacheKey, response, cacheTtlSeconds.playlists);
  return res.status(200).json(response);
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "No Playlist found!");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only modify your own playlists");
  }

  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    throw new ApiError(404, "No Video found!");
  }

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
    await invalidatePlaylistCaches({
      ownerId: req.user._id.toString(),
      playlistId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video Added to the playlist!!"));
  } else {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          playlist,
          "Video is already Added to the playlist!!"
        )
      );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "No Playlist found!");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only modify your own playlists");
  }

  const previousLength = playlist.videos.length;
  playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);

  if (playlist.videos.length === previousLength) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, playlist, "Video not Found in the playlist!!")
      );
  }

  await playlist.save();
  await invalidatePlaylistCaches({
    ownerId: req.user._id.toString(),
    playlistId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video is deleted from the playlist!!")
    );
});

const deletePlayList = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "No Playlist found!");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own playlists");
  }
  await playlist.deleteOne();
  await invalidatePlaylistCaches({
    ownerId: req.user._id.toString(),
    playlistId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted Successfully!!"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { newName, newDescription } = req.body;
  if (!(newName && newDescription)) {
    throw new ApiError(400, "No update was made!");
  }

  const existingPlaylist = await Playlist.findById(playlistId);
  if (!existingPlaylist) {
    throw new ApiError(404, "Playlist wasn't found");
  }
  if (existingPlaylist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own playlists");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name: newName,
        description: newDescription,
      },
    },
    { new: true }
  );
  if (!playlist) {
    throw new ApiError(500, "Playlist wasn't updated ");
  }
  await invalidatePlaylistCaches({
    ownerId: req.user._id.toString(),
    playlistId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist was successfully updated!"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlayList,
  updatePlaylist,
};
