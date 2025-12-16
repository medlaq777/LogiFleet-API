import Alert from "../models/alert.model.js";

class AlertRepository {
  async create(data) {
    return await Alert.create(data);
  }

  async update(id, data) {
    return await Alert.findByIdAndUpdate(id, data, { new: true });
  }

  async findOpenByTruckId(truckId) {
    return await Alert.find({ truckId });
  }

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const items = await Alert.find()
      .populate("truckId")
      .populate("tireId")
      .skip(skip)
      .limit(limit);
    const total = await Alert.countDocuments();
    return { items, total };
  }
}

export default new AlertRepository();
