import mongoose, { mongo } from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    trailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trailer" },
    departureLocation: { type: String, required: true },
    arrivalLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["À faire", "En cours", "Terminé", "Annulé"],
      default: "À faire",
    },
    startMileage: { type: Number },
    endMileage: { type: Number },
    fuelVolumeAdded: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", TripSchema);
