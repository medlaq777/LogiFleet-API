import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 30,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, trim: true },
    role: { type: String, enum: ["Driver", "Admin"], default: "Driver" },
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);
