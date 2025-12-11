import Alert from "../models/alert.model.js";

class AlertRepository {
  async create(data) {
    return await Alert.create(data);
  }

  async findOpenByTruckId(truckId) {
    return await Alert.find({ truckId, status: "Open" });
  }
}

export default new AlertRepository();
