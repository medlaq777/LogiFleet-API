import Truck from "../models/trucks.model.js";
import VehicleRepository from "./vehicle.repository.js";

class TruckRepository extends VehicleRepository {
  constructor() {
    super(Truck);
  }

  async findAvailable() {
    return this.model.find({ status: "Disponible" });
  }

  async findByLicensePlate(licensePlate) {
    return this.model.find({ licensePlate: licensePlate });
  }
}
export default new TruckRepository();
