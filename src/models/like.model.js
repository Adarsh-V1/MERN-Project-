import mongoose, { model, Schema } from "mongoose";


const likeSchema = new Schema({
   comment:{
      type: Schema.Types.ObjectId,
      ref: "Comment"
   },
   video:{
      type: Schema.Types.ObjectId,
      ref: "Video"
   },
   likedBy:{
      type: Schema.Types.ObjectId,
      ref: "User"
   },

},{timestamps:true})

likeSchema.index(
  { video: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true } } }
)
likeSchema.index(
  { comment: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
)

export const Like = model("Like",likeSchema)
