import { HotTake } from "../models/hotTake.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTakes = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "No HotTake content was provided!!");
  }
  const hotTake = await HotTake.create({
    content,
    owner: req.user._id,
  });

  if (!hotTake) {
    throw new ApiError(500, "HotTake wasn't created!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, hotTake, "HotTake was created Successfully "));
});

const getAllTakes = asyncHandler(async (req, res) => {
  const allHotTakes = await HotTake.find().populate(
    "owner",
    "-password -refreshToken"
  );
  if (!allHotTakes) {
    throw new ApiError(500, "No HotTakes found!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, allHotTakes, "All HotTakes fetched successfully")
    );
});

const getUserTakes = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userHotTakes = await HotTake.find({ owner: userId }).populate(
    "owner",
    "-password -refreshToken"
  );
  if (!userHotTakes) {
    throw new ApiError(500, "No HotTake found for this user! ");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, userHotTakes, "HotTakes were fetched Successfully")
    );
});

const updateTakes = asyncHandler(async (req, res) => {
  const { takeId } = req.params;
  const { newContent } = req.body;
  if (!newContent) {
    throw new ApiError(400, "No updated HotTake was provided");
  }

  const existingTake = await HotTake.findById(takeId);
  if (!existingTake) {
    throw new ApiError(404, "No HotTake was found ");
  }
  if (existingTake.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own HotTakes");
  }

  const userHotTake = await HotTake.findByIdAndUpdate(
    takeId,
    {
      $set: {
        content: newContent,
      },
    },
    { new: true }
  ).populate("owner", "-password -refreshToken");
  if (!userHotTake) {
    throw new ApiError(500, "No HotTake was found ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userHotTake, "HotTake Updated Successfully "));
});

const deleteTakes = asyncHandler(async (req, res) => {
  const { takeId } = req.params;
  const hotTake = await HotTake.findById(takeId);
  if (!hotTake) {
    throw new ApiError(404, "No HotTake was found ");
  }
  if (hotTake.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own HotTakes");
  }
  await hotTake.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "HotTake deleted Successfully "));
});

const rateCapTake = asyncHandler(async (req, res) => {
  const { takeId } = req.params;
  const userId = req.user._id;
  const hotTake = await HotTake.findById(takeId);
  if (!hotTake) {
    throw new ApiError(400, "No HotTake was found!");
  }

  hotTake.cap = hotTake.cap.filter((id) => id.toString() !== userId.toString());

  hotTake.mid = hotTake.mid.filter((id) => id.toString() !== userId.toString());

  hotTake.facts = hotTake.facts.filter(
    (id) => id.toString() !== userId.toString()
  );

  hotTake.cap.push(userId);

  await hotTake.save();

  return res
    .status(200)
    .json(new ApiResponse(200, hotTake, "Rated as Cap successfully!"));
});

const rateMidTake = asyncHandler(async (req, res) => {
  const { takeId } = req.params;
  const userId = req.user._id;
  const hotTake = await HotTake.findById(takeId);
  if (!hotTake) {
    throw new ApiError(400, "No HotTake was found!");
  }

  hotTake.cap = hotTake.cap.filter((id) => id.toString() !== userId.toString());
  hotTake.mid = hotTake.mid.filter((id) => id.toString() !== userId.toString());
  hotTake.facts = hotTake.facts.filter(
    (id) => id.toString() !== userId.toString()
  );

  hotTake.mid.push(userId);

  await hotTake.save();

  return res
    .status(200)
    .json(new ApiResponse(200, hotTake, "Rated as Mid successfully!"));
});

const rateFactsTake = asyncHandler(async (req, res) => {
  const { takeId } = req.params;
  const userId = req.user._id;
  const hotTake = await HotTake.findById(takeId);
  if (!hotTake) {
    throw new ApiError(400, "No HotTake was found!");
  }

  hotTake.cap = hotTake.cap.filter((id) => id.toString() !== userId.toString());
  hotTake.mid = hotTake.mid.filter((id) => id.toString() !== userId.toString());
  hotTake.facts = hotTake.facts.filter(
    (id) => id.toString() !== userId.toString()
  );

  hotTake.facts.push(userId);

  await hotTake.save();
  return res
    .status(200)
    .json(new ApiResponse(200, hotTake, "Rated as Facts  successfully!"));
});

export {
  createTakes,
  updateTakes,
  deleteTakes,
  getUserTakes,
  rateCapTake,
  rateFactsTake,
  rateMidTake,
  getAllTakes,
};
