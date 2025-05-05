import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    rating: {
      type: Number,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
