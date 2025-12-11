import MaintenanceRule from "../models/maintenanceRule.model.js";

class MaintenanceRepository {
  async findAll() {
    return await MaintenanceRule.find();
  }

  async updateRule(type, data) {
    return await MaintenanceRule.findOneAndUpdate({ type }, data, {
      new: true,
      upsert: true,
    });
  }
}

export default new MaintenanceRepository();
