import mongoose from "mongoose";

const followAndFollowerSchema = new mongoose.Schema(
  {
    Follow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  {
    timestamps: true,
  }
);

const followAndFollowerModule = mongoose.model(
  "FollowAndFollower",
  followAndFollowerSchema
);

export default followAndFollowerModule;
