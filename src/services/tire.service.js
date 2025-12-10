import TireRepository from "../repositories/tire.repository.js";

class TireService {
  constructor(tireRepository) {
    this.tireRepository = tireRepository;
  }

  async getAllTire() {
    return this.tireRepository.getAllTire();
  }

  async createTire(data) {
    if (!data.serialNumber || !data.brand || !data.type || !data.expectedLife) {
      const err = new Error(
        "Serial Number, brand, type and expected life are required"
      );
      err.status = 400;
      throw err;
    }
    const existTire = await this.tireRepository.findBySerialNumber({
      serialNumber: serialNumber,
    });
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

    if (data.locationType && data.locationType !== tire.locationType) {
      const err = new Error("use install or remove methods");
      err.status = 400;
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

    if (tire.locationType !== "Stock") {
      const err = new Error("Cannot remove tire in service");
      err.status = 400;
      throw err;
    }

    return this.tireRepository.delete(id);
  }
}
export default new TireService(TireRepository);
