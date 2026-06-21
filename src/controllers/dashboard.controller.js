import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import { HotTake } from "../models/hotTake.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Comment } from "../models/comment.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const videos = await Video.find({ owner: userId });
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce(
    (sum, v) => sum + (v.likesCount || 0),
    0
  );
  const totalComments = await Comment.countDocuments({
    video: { $in: videos.map((video) => video._id) },
  });

  const playlists = await Playlist.find({ owner: userId });
  const totalPlaylists = playlists.length;

  const hotTakes = await HotTake.find({ owner: userId });
  const totalHotTakes = hotTakes.length;

  const subscriptions = await Subscription.find({ channel: userId });
  const totalSubscribers = subscriptions.length;


  const mostViewedVideo = videos.reduce(
    (max, v) => (v.views > (max?.views || 0) ? v : max),
    null
  );

  const mostLikedVideo = videos.reduce(
    (max, v) =>
      (v.likesCount || 0) > (max?.likesCount || 0) ? v : max,
    null
  );


  const avgViews = totalVideos ? totalViews / totalVideos : 0;

  const avgLikes = totalVideos ? totalLikes / totalVideos : 0;



  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews,
        totalLikes,
        totalComments,
        totalSubscribers,
        totalPlaylists,
        totalHotTakes,
        mostViewedVideo,
        mostLikedVideo,
        avgViews,
        avgLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userVideos = await Video.find({ owner: req.user._id }).populate(
    "owner",
    "-password -refreshToken"
  );
  if (userVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "This channel has no Videos"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userVideos,
        "All Videos of Channel Fetchec Successfully "
      )
    );
});

const getChannelTakes = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const hotTakes = await HotTake.find({ owner: userId }).populate(
    "owner",
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, hotTakes, "User's hot takes fetched successfully")
    );
});

export { getChannelStats, getChannelVideos, getChannelTakes };
