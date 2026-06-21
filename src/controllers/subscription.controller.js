import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }
  if (!(await User.exists({ _id: channelId }))) {
    throw new ApiError(404, "Channel not found");
  }
  const alreadySubscribed = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (alreadySubscribed) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed Successfully!!"));
  }

  const subscribe = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  });
  if (!subscribe) {
    throw new ApiError(500, "Failed to subscribe this channel");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subscribe, "channel Subscribed Successfully "));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "No channelId is Provided");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Fetched Subscriber of this User"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "No subscriberId is Provided");
  }
  const channels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Fetched Channels Subscribed by this User")
    );
});

export { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers };
