import ReportRepository from "../repositories/report.repository.js";

class ReportService {
  constructor(repository) {
    this.repository = repository;
  }

  async getDashboardStats() {
    const tripStats = await this.repository.getTripStats();
    const maintenanceStats = await this.repository.getMaintenanceStats();

    const stats = tripStats[0] || { totalDistance: 0, totalFuel: 0, count: 0 };

    const avgConsumption =
      stats.totalDistance > 0
        ? (stats.totalFuel / stats.totalDistance) * 100
        : 0;

    return {
      totalKm: stats.totalDistance,
      avgConsumption: Number.parseFloat(avgConsumption.toFixed(2)),
      pendingMaintenance: maintenanceStats.pendingMaintenance,
    };
  }
}

export default new ReportService(ReportRepository);
