import MaintenanceService from "../services/maintenance.service.js";

class MaintenanceController {
  constructor(service) {
    this.service = service;
  }

  async getRules(req, res, next) {
    try {
      const page = Number.parseInt(req.query.page) || 1;
      const limit = Number.parseInt(req.query.limit) || 10;
      const { items, total } = await this.service.getRules(page, limit);
      res.status(200).json({ success: true, count: total, data: items });
    } catch (err) {
      next(err);
    }
  }

  async getAlerts(req, res, next) {
    try {
      const page = Number.parseInt(req.query.page) || 1;
      const limit = Number.parseInt(req.query.limit) || 10;
      const { items, total } = await this.service.getAlerts(page, limit);
      res.status(200).json({ success: true, count: total, data: items });
    } catch (err) {
      next(err);
    }
  }

  async updateAlert(req, res, next) {
    try {
      const alert = await this.service.updateAlert(req.params.id, req.body);
      res.status(200).json({ success: true, data: alert });
    } catch (err) {
      next(err);
    }
  }

  async updateRule(req, res, next) {
    try {
      const rule = await this.service.updateRule(req.body);
      res.status(200).json({ success: true, data: rule });
    } catch (err) {
      next(err);
    }
  }
}

export default new MaintenanceController(MaintenanceService);
