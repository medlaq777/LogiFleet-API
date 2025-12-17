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
      const page = Number.parseInt(req.query.page) || 1;
      const limit = Number.parseInt(req.query.limit) || 10;
      const { items, total } = await this.service.getAllTrucks(page, limit);
      res
        .status(200)
        .json({ success: true, count: total, data: items });
    } catch (err) {
      next(err);
    }
  }

  async updateTruck(req, res, next) {
    try {
      const truck = await this.service.updateTruck(req.params.id, req.body);
      res.status(200).json({ success: true, data: truck });
    } catch (err) {
      next(err);
    }
  }

  async deleteTruck(req, res, next) {
    try {
      await this.service.deleteTruck(req.params.id);
      res.status(200).json({ success: true, message: "Truck Was Deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default new TruckController(TruckService);
