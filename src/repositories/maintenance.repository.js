import MaintenanceRule from "../models/maintenanceRule.model.js";

class MaintenanceRepository {
  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const items = await MaintenanceRule.find().skip(skip).limit(limit);
    const total = await MaintenanceRule.countDocuments();
    return { items, total };
  }

  async findByType(type) {
    return await MaintenanceRule.findOne({ type });
  }

  async updateRule(type, data) {
    return await MaintenanceRule.findOneAndUpdate({ type }, data, {
      new: true,
      upsert: true,
    });
  }
}

export default new MaintenanceRepository();
