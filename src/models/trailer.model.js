import mongoose from "mongoose";

const TrailerSchema = new mongoose.Schema(
  {
    licensePlate: { type: String, required: true, unique: true, trim: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["Disponible", "Attachée", "Maintenance"],
      default: "Disponible",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trailer", TrailerSchema);
