import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Rojer" },
    email: { type: String, required: true, unique: true },
    profile: { type: String, default: "Developer" },
    number: { type: String, required: true, unique: true },
    isStatus:{type: Boolean, default: true}
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;