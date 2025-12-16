import mongoose from "mongoose";

const TireSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    currentMileageOnTire: { type: Number, default: 0, min: 0 },
    expectedLife: { type: Number, required: true, min: 1, max: 100000 },
  },
  { timestamps: true }
);

export default mongoose.model("Tire", TireSchema);
