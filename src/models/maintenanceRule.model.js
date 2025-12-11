import mongoose from "mongoose";

const MaintenanceRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["Vidange", "Pneus", "Révision Technique"],
    },
    intervalKm: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceRule", MaintenanceRuleSchema);
