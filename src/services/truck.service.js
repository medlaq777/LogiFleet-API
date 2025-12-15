import TruckRepository from "../repositories/truck.repository.js";

class TruckService {
  constructor(truckRepository) {
    this.truckRepository = truckRepository;
  }

  async getAllTrucks(page, limit) {
    return this.truckRepository.findAll(page, limit);
  }

  async findById(id) {
    return this.truckRepository.findById(id);
  }

  async createTruck(data) {
    if (!data.licensePlate || !data.make || !data.model) {
      const err = new Error("license plate, make or model are required");
      err.status = 400;
      throw err;
    }
    const existTruck = await this.truckRepository.findByLicensePlate(
      data.licensePlate
    );
    if (existTruck) {
      const err = new Error("Truck with license plate Already existe");
      err.status = 409;
      throw err;
    }

    return this.truckRepository.create(data);
  }

  async updateTruck(id, data) {
    const truck = await this.truckRepository.findById(id);
    if (!truck) {
      const err = new Error("Truk Not Found");
      err.status = 404;
      throw err;
    }

    if (data.status === "En service" && truck.driver === null) {
      const err = new Error("Cannot update status without driver assigned");
      err.status = 400;
      throw err;
    }
    return this.truckRepository.update(id, data);
  }

  async deleteTruck(id) {
    const truck = await this.truckRepository.findById(id);
    if (!truck) {
      const err = new Error("Truk Not Found");
      err.status = 404;
      throw err;
    }
    if (truck.status === "En service") {
      const err = new Error("Cannot delete truck in service");
      err.status = 400;
      throw err;
    }
    return this.truckRepository.delete(id);
  }
}
export default new TruckService(TruckRepository);
