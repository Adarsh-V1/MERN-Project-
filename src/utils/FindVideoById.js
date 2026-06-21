import { ApiError } from "./ApiError.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

async function helperFindVideoId(videoId) {
  if (!videoId?.trim() || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const video = await Video.findById(videoId).populate(
    "owner",
    "-password -refreshToken"
  );
  
  if (!video) {
    throw new ApiError(400, "No video Exists");
  }
  return video;
}

export { helperFindVideoId }
