import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Maintenance", "Pneus", "Administratif"],
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Resolved", "Ignored"],
      default: "Open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", AlertSchema);
