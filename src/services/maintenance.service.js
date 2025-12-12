import MaintenanceRepository from "../repositories/maintenance.repository.js";
import AlertRepository from "../repositories/alert.repository.js";
import TireRepository from "../repositories/tire.repository.js";

class MaintenanceService {
  constructor(repository, alertRepository, tireRepository) {
    this.repository = repository;
    this.alertRepository = alertRepository;
    this.tireRepository = tireRepository;
  }

  async getRules() {
    return await this.repository.findAll();
  }

  async getAlerts() {
    return await this.alertRepository.findAll();
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
