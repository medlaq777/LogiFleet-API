import MaintenanceRepository from "../repositories/maintenance.repository.js";
import AlertRepository from "../repositories/alert.repository.js";
import TireRepository from "../repositories/tire.repository.js";

class MaintenanceService {
  constructor(repository, alertRepository, tireRepository) {
    this.repository = repository;
    this.alertRepository = alertRepository;
    this.tireRepository = tireRepository;
  }

  async getRules(page, limit) {
    return await this.repository.findAll(page, limit);
  }

  async getAlerts(page, limit) {
    return await this.alertRepository.findAll(page, limit);
  }

  async updateAlert(id, data) {
    return await this.alertRepository.update(id, data);
  }

  async updateRule(data) {
    if (!data.type || !data.intervalKm) {
      const err = new Error("Type and Interval are required");
      err.status = 400;
      throw err;
    }
    return await this.repository.updateRule(data.type, data);
  }

  async checkDailyTires() {
    const tires = await this.tireRepository.findAll();
    for (const tire of tires) {
      if (tire.currentMileageOnTire >= tire.expectedLife) {
        await this.alertRepository.create({
          tireId: tire._id,
          type: "Pneus",
          message: `Tire ${tire.serialNumber} reached expected life (${tire.expectedLife} km). Replacement required.`,
        });
      }
    }
  }
}

export default new MaintenanceService(
  MaintenanceRepository,
  AlertRepository,
  TireRepository
);
