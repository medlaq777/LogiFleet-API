import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: false,
    },
    tireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["Maintenance", "Pneus"],
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", AlertSchema);
