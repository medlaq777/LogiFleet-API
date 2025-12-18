import ReportRepository from "../repositories/report.repository.js";

class ReportService {
  constructor(repository) {
    this.repository = repository;
  }

  async getDashboardStats() {
    const tripStats = await this.repository.getTripStats();
    const maintenanceStats = await this.repository.getMaintenanceStats();
    const counts = await this.repository.getCounts();

    const fuelStats = await this.repository.getFuelStats();
    const maintenanceCostStats = await this.repository.getMaintenanceCostStats();

    const stats = tripStats[0] || { totalDistance: 0, totalFuel: 0, count: 0 };

    const avgConsumption =
      stats.totalDistance > 0
        ? (stats.totalFuel / stats.totalDistance) * 100
        : 0;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fuelLabels = fuelStats.map(s => monthNames[s._id.month - 1]);
    const fuelData = fuelStats.map(s => s.totalFuel);


    const maintenanceLabels = [];
    const maintenanceData = [];

    const typeMapping = {
      "Maintenance": "Repairs",
      "Pneus": "Tires",
      "Oil": "Oil Change",
      "Inspection": "Inspection"
    };

    maintenanceCostStats.forEach(s => {
      maintenanceLabels.push(typeMapping[s._id] || s._id);
      maintenanceData.push(s.totalCost);
    });

    return {
      totalKm: stats.totalDistance,
      avgConsumption: Number.parseFloat(avgConsumption.toFixed(2)),
      pendingMaintenance: maintenanceStats.pendingMaintenance,
      ...counts,
      fuelChart: { labels: fuelLabels, data: fuelData },
      maintenanceChart: { labels: maintenanceLabels, data: maintenanceData }
    };
  }
}

export default new ReportService(ReportRepository);
