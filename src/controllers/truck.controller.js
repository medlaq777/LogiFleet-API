import TruckService from "../services/truck.service.js";

class TruckController {
  constructor(service) {
    this.service = service;
  }
  async createTruck(req, res, next) {
    try {
      const newTruck = await this.service.createTruck(req.body);
      res.status(201).json({ success: true, data: newTruck });
    } catch (err) {
      next(err);
    }
  }
  async getAllTrucks(req, res, next) {
    try {
      const trucks = await this.service.getAllTrucks();
      res
        .status(200)
        .json({ success: true, count: trucks.length, data: trucks });
    } catch (err) {
      next(err);
    }
  }

  async updateTruck(req, res, next) {
    try {
      const truck = await this.service.updateTruck(req.body);
      res.status(200).json({ success: true, data: truck });
    } catch (err) {
      next(err);
    }
  }

  async deleteTruck(req, res, next) {
    try {
      await this.service.deleteTruck(req.body);
      res.status(200).json({ success: true, message: "Truck Was Deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default new TruckController(TruckService);
