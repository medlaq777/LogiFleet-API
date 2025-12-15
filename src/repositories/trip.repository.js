import Trip from "../models/trip.model.js";
import VehicleRepository from "./vehicle.repository.js";

class TripRepository extends VehicleRepository {
  constructor() {
    super(Trip);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.model
      .find()
      .populate("driverId", "firstName lastName")
      .populate("truckId", "licensePlate make model")
      .populate("trailerId", "licensePlate")
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);
  }
  
  async findByDriverId(driverId) {
    return this.model
      .find({ driverId })
      .populate("truckId", "licensePlate make model")
      .populate("trailerId", "licensePlate")
      .sort({ startDate: -1 });
  }
  async findByIdPopulated(id) {
    return this.model
      .findById(id)
      .populate("driverId", "firstName lastName")
      .populate("truckId", "licensePlate make model currentMileage")
      .populate("trailerId", "licensePlate");
  }
}

export default new TripRepository();
