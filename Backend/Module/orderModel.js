import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 20,
    },
    itemTotal: {
      type: Number,
      required: true,
    },
    product: {
      type: Array,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    numOfProducts:{
        type: Number,
        default: 0,
    },
    orderStatus:{
      type:String,
      enum:["Pending","Confirmed","Cancelled","Pending"],
      default:"Pending"
    }
  },
  {
    timestamps: true,
  }
);

const createOrderModel = mongoose.model("Order", orderSchema);

export default createOrderModel;
