import MaintenanceRepository from "../repositories/maintenance.repository.js";

class MaintenanceService {
  constructor(repository) {
    this.repository = repository;
  }

  async getRules() {
    return await this.repository.findAll();
  }

  async updateRule(data) {
    if (!data.type || !data.intervalKm) {
      const err = new Error("Type and Interval are required");
      err.status = 400;
      throw err;
    }
    return await this.repository.updateRule(data.type, data);
  }
}

export default new MaintenanceService(MaintenanceRepository);
