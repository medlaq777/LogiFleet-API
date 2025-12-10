import TireService from "../services/tire.service.js";

class TireController {
  constructor(service) {
    this.service = service;
  }

  async createTire(req, res, next) {
    try {
      const newTire = await this.service.createTire(req.body);
      res.status(201).json({ success: true, data: newTire });
    } catch (err) {
      next(err);
    }
  }

  async getAllTire(req, res, next) {
    try {
      const tires = await this.service.getAllTire();
      res.status(200).json({ success: true, count: tires.length, data: tires });
    } catch (err) {
      next(err);
    }
  }

  async updateTire(req, res, next) {
    try {
      const tire = await this.service.updateTire(req.params.id, req.body);
      res.status(200).json({ success: true, data: tire });
    } catch (err) {
      next(err);
    }
  }

  async deleteTire(req, res, next) {
    try {
      await this.service.deleteTire(req.params.id);
      res.status(200).json({ success: true, message: "Tire was deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default new TireController(TireService);
