import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { logger } from "../utils/logger.js";
import { Video } from "../models/video.model.js";
import { getCachedJson, setCachedJson } from "../services/cache.service.js";
import { cacheKeys, cacheTtlSeconds } from "../utils/cacheKeys.js";
import {
  invalidateChannelCaches,
  invalidateCommentCaches,
} from "../utils/cacheInvalidation.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const cacheKey = cacheKeys.videoComments(videoId, { page, limit });
  const cachedResponse = await getCachedJson(cacheKey);

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const allComments = await Comment.find({ video: videoId })
    .populate("owner", "-password -refreshToken")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  logger.debug("Video comments fetched", {
    videoId,
    resultCount: allComments.length,
  });
  if (!allComments) {
    throw new ApiError("Can't fetch comments");
  }

  const response = new ApiResponse(
    200,
    allComments,
    "All comments Fetched Successfully!"
  );

  await setCachedJson(cacheKey, response, cacheTtlSeconds.videoComments);

  return res.status(200).json(response);
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "No comment was Provided");
  }

  const video = await Video.findById(videoId).select("owner");
  if (!video) {
    throw new ApiError(404, "No Video was Found");
  }

  const addComment = await Comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  if (!addComment) {
    throw new ApiError("Comment was not added!");
  }
  logger.info("Comment created", {
    commentId: addComment._id.toString(),
    videoId,
    ownerId: req.user._id.toString(),
  });

  await invalidateCommentCaches(videoId);
  await invalidateChannelCaches(video.owner.toString());

  return res
    .status(200)
    .json(new ApiResponse(200, addComment, "Comment Added Successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body;
  if (!newComment?.trim()) {
    throw new ApiError(400, "Please provide a comment to update");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment wasn't found");
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own comments");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newComment,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError(500, "Comment wasn't updated ");
  }

  const commentVideo = await Video.findById(comment.video).select("owner");
  await invalidateCommentCaches(comment.video.toString());
  await invalidateChannelCaches(commentVideo?.owner?.toString());

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated successfully!!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment wasn't found");
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  const commentVideo = await Video.findById(comment.video).select("owner");
  await Comment.findByIdAndDelete(commentId);
  await invalidateCommentCaches(comment.video.toString());
  await invalidateChannelCaches(commentVideo?.owner?.toString());

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully! "));
});

export { getVideoComments, addComment, deleteComment, updateComment };
