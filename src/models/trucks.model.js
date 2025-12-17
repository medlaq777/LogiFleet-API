import mongoose from "mongoose";

const TruckSchema = new mongoose.Schema(
  {
    licensePlate: { type: String, required: true, unique: true, trim: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1, max: 1000 },
    currentMileage: { type: Number, default: 0, min: 0 },
    fuelLevel: { type: Number, default: 100, min: 0, max: 100 },
    fuelType: {
      type: String,
      enum: ["Diesel", "Essence", "Electrique"],
      default: "Diesel",
    },
    status: {
      type: String,
      enum: ["Disponible", "En service", "En Maintenance"],
      default: "Disponible",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", TruckSchema);
