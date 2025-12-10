import Trailer from "../models/trailer.model.js";
import VehicleRepository from "./vehicle.repository.js";

class TrailerRepository extends VehicleRepository {
  constructor() {
    super(Trailer);
  }

  async findAvailable() {
    return this.model.find({ status: "Disponible" });
  }
}
export default new TrailerRepository();
