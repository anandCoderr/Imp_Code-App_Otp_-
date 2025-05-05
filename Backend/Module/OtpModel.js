import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    isVerified:{type:Boolean,default:false},
    expireAt: { type: Date, default: () => Date.now() + 5 * 60 * 1000 },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;