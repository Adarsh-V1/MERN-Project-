import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { helperFindVideoId } from "../utils/FindVideoById.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.js";




const getAllVideosOfUser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
  
  let filter = {owner:userId || req.user._id};

  const pageNum = Number(page)
  const limitNum = Number(limit)
  
  if(query){
    filter.$or = [
      {title : {$regex:query,  $options:"i"}},
      {description: {$regex:query, $options:"i"}}
    ]
  }

  const allVideos = await Video.find(filter)
  .skip((pageNum-1) * limitNum)
  .limit(limitNum)
  .sort({[sortBy]: sortType === "desc"? -1:1})

  if(!allVideos || allVideos.length === 0){
    throw new ApiError(404, "No Videos Found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, allVideos, "Videos fetched successfully!")
  )
  
});

const showAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc"} = req.query;

  let filter = {}
  const pageNum = Number(page)
  const limitNum = Number(limit)
  
  if(query){
    filter.$or = [
      {title : {$regex:query,  $options:"i"}},
      {description: {$regex:query, $options:"i"}}
    ]
  }

  const allVideos = await Video.find(filter).populate(
    "owner",
    "-password -refreshToken"
  )
  .skip((pageNum-1) * limitNum)
  .limit(limitNum)
  .sort({[sortBy]: sortType === "desc"? -1:1})

  if(!allVideos || allVideos.length === 0){
    throw new ApiError(404, "No Videos Found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, allVideos, "Videos fetched successfully!")
  )
  
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title && description)) {
    throw new ApiError(400, "Title or Description are missing!");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!(videoFileLocalPath && thumbnailLocalPath)) {
    throw new ApiError(400, "VideoLocal File and ThumbnailLocal are required!");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  if (!(videoFile && thumbnail)) {
    throw new ApiError(400, "Video File and thumbnail are required  ");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user._id,
    duration: videoFile.duration || 0,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Video wasn't uplaoded ! Failed upload");
  }

  logger.info("Video published", {
    videoId: createdVideo._id.toString(),
    ownerId: req.user._id.toString(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "Video Uploaded SuccessFully !"));
});


const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await helperFindVideoId(videoId);

  if(!video.viewedBy.includes(req.user._id)){
    video.views  += 1
    video.viewedBy.push(req.user._id)
    await video.save()

  
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchHistory: videoId } },
      { new: true }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is Successfully Fetched!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId)

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own videos");
  }

  const { newTitle, newDescription } = req.body;
  
  if (!newTitle || !newDescription) {
    throw new ApiError(400, "new title and Description not received!");
  }

  const thumbnailLocalPath =  req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(404, "thumbnail not Received!");
  }

  const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!newThumbnail) {
    throw new ApiError(404, "New thumbnail was not set !");
  }
  const videoUpdated = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: newTitle,
        description: newDescription,
        thumbnail: newThumbnail.url
      },
    },
    {
      new: true,
    }
  ).select(" -isPublished -videoFile ");

  if (!video) {
    throw new ApiError(500, "video is not found ");
  }
  logger.debug("Video updated", {
    videoId: videoUpdated._id.toString(),
    ownerId: req.user._id.toString(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200,videoUpdated, "Video Details updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId);

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own videos");
  }

  await video.deleteOne()
  
  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Video deleted Successfully")
  )
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId);

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only change your own videos");
  }
  const newStatus = !video.isPublished;

  await video.updateOne(
    {
      $set:{ isPublished: newStatus}
    },
    {new:true}
  )

  return res 
  .status(200)
  .json(
    new ApiResponse(200,newStatus, `isPublished is set ${newStatus} `)
  )

});

export {
  showAllVideos,
  getVideoById,
  updateVideo,
  publishVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosOfUser,
};
