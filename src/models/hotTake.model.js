import mongoose, { model, Schema } from "mongoose";
import { User } from "./user.model.js";
const hotTakeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    cap: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mid: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    facts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const HotTake = model("HotTake", hotTakeSchema);
