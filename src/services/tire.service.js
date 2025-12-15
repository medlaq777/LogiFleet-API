import TireRepository from "../repositories/tire.repository.js";
import MaintenanceRepository from "../repositories/maintenance.repository.js";

class TireService {
  constructor(tireRepository) {
    this.tireRepository = tireRepository;
  }

  async getAllTire(page, limit) {
    return this.tireRepository.findAll(page, limit);
  }

  async createTire(data) {
    if (!data.serialNumber || !data.brand || !data.type || !data.expectedLife) {
      const err = new Error(
        "Serial Number, brand, type and expected life are required"
      );
      err.status = 400;
      throw err;
    }
    const existTire = await this.tireRepository.findBySerialNumber(
      data.serialNumber
    );
    if (existTire) {
      const err = new Error("Tire with serial number Already existe");
      err.status = 409;
      throw err;
    }
    return this.tireRepository.create(data);
  }

  async updateTire(id, data) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    return this.tireRepository.update(id, data);
  }

  async deleteTire(id) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    return this.tireRepository.delete(id);
  }

  async checkMaintenance(id) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    const rule = await MaintenanceRepository.findByType("Pneus");
    let status = "Good";

    if (tire.currentMileageOnTire >= tire.expectedLife) {
      status = "Critical: Expected Life Exceeded";
    } else if (rule && tire.currentMileageOnTire >= rule.intervalKm) {
      status = "Maintenance Needed";
    }

    return {
      tireId: tire._id,
      serialNumber: tire.serialNumber,
      currentMileage: tire.currentMileageOnTire,
      expectedLife: tire.expectedLife,
      maintenanceInterval: rule ? rule.intervalKm : "N/A",
      status: status,
    };
  }
}
export default new TireService(TireRepository);
