import ReportService from "../services/report.service.js";

class ReportController {
  constructor(service) {
    this.service = service;
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.service.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }
}

export default new ReportController(ReportService);
