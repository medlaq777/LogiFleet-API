import mongoose from "mongoose";

const TireSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    installedMileage: { type: Number, default: 0, min: 0 },
    currentMileageOnTire: { type: Number, default: 0, min: 0 },
    expectedLife: { type: Number, required: true, min: 1, max: 1000 },
    locationType: {
      type: String,
      enum: ["Truck", "Trailer", "Stock"],
      default: "Stock",
    },
    locationId: { type: mongoose.Schema.Types.ObjectId, default: null },
    position: { type: String, default: "Stock" },
  },
  { timestamps: true }
);

export default mongoose.model("Tire", TireSchema);
