import TireRepository from "../repositories/tire.repository.js";

class TireService {
  constructor(tireRepository) {
    this.tireRepository = tireRepository;
  }

  async getAllTire() {
    return this.tireRepository.findAll();
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
    data.locationType = "Stock";
    data.locationId = null;
    data.position = "Stock";
    return this.tireRepository.create(data);
  }

  async updateTire(id, data) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    delete data.locationType;
    delete data.locationId;
    delete data.position;

    return this.tireRepository.update(id, data);
  }

  async deleteTire(id) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    if (tire.locationType !== "Stock") {
      const err = new Error("Cannot remove tire in service");
      err.status = 400;
      throw err;
    }

    return this.tireRepository.delete(id);
  }

  async installTire(id, data) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    if (tire.locationType !== "Stock") {
      const err = new Error("Tire must be in Stock to be installed");
      err.status = 400;
      throw err;
    }

    return this.tireRepository.assignTire(
      id,
      data.locationType,
      data.locationId,
      data.position,
      data.installedMileage
    );
  }

  async removeTire(id) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      const err = new Error("Tire Not Found");
      err.status = 404;
      throw err;
    }

    if (tire.locationType === "Stock") {
      const err = new Error("Tire is already in Stock");
      err.status = 400;
      throw err;
    }

    return this.tireRepository.assignTire(id, "Stock", null, null, null);
  }

  async getTiresByLocation(truckId) {
    return this.tireRepository.findByLocation(truckId);
  }

  async addMileage(tireId, distance) {
    const tire = await this.tireRepository.findById(tireId);
    if (!tire) return;

    const newMileage = (tire.currentMileageOnTire || 0) + distance;
    return this.tireRepository.update(tireId, {
      currentMileageOnTire: newMileage,
    });
  }
}
export default new TireService(TireRepository);
