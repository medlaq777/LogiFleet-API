import Tire from "../models/tire.model.js";
import VehicleRepository from "./vehicle.repository.js";

class TireRepository extends VehicleRepository {
  constructor() {
    super(Tire);
  }

  async findBySerialNumber(serialNumber) {
    return this.model.findOne({ serialNumber: serialNumber });
  }

  async findInStock() {
    return this.model.find({ locationType: "Stock" });
  }
  async assignTire(tireId, locationType, locationId, position, mileage) {
    return this.model.findByIdAndUpdate(
      tireId,
      {
        locationType,
        locationId,
        position,
        installedMileage: mileage,
        currentMileageOnTire: 0,
      },
      { new: true }
    );
  }
}
export default new TireRepository();
