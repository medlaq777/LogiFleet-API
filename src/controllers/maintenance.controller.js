import MaintenanceService from "../services/maintenance.service.js";

class MaintenanceController {
  constructor(service) {
    this.service = service;
  }

  async getRules(req, res, next) {
    try {
      const rules = await this.service.getRules();
      res.status(200).json({ success: true, data: rules });
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
