import mongoose, { model, Schema } from "mongoose";
const subscriptionsSchema = new Schema({

  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},{timestamps :true})

subscriptionsSchema.index({ subscriber: 1, channel: 1 }, { unique: true })

export const Subscription = model("Subscription",subscriptionsSchema)
