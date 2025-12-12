import Tire from "../models/tire.model.js";
import VehicleRepository from "./vehicle.repository.js";

class TireRepository extends VehicleRepository {
  constructor() {
    super(Tire);
  }

  async findBySerialNumber(serialNumber) {
    return this.model.findOne({ serialNumber: serialNumber });
  }
}
export default new TireRepository();
