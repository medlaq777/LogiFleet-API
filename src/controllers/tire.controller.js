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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { items, total } = await this.service.getAllTire(page, limit);
      res.status(200).json({ success: true, count: total, data: items });
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

  async checkMaintenance(req, res, next) {
    try {
      const status = await this.service.checkMaintenance(req.params.id);
      res.status(200).json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }
}

export default new TireController(TireService);
