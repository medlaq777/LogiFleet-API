import reportService from "../../src/services/report.service.js";
import ReportRepository from "../../src/repositories/report.repository.js";

jest.mock("../../src/repositories/report.repository.js", () => ({
  __esModule: true,
  default: {
    getTripStats: jest.fn(),
    getMaintenanceStats: jest.fn(),
    getCounts: jest.fn(),
    getFuelStats: jest.fn(),
    getMaintenanceCostStats: jest.fn(),
  },
}));

describe("ReportService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDashboardStats", () => {
    it("calculates stats and average consumption when trip stats exist", async () => {
      ReportRepository.getTripStats.mockResolvedValue([
        { totalDistance: 1000, totalFuel: 200, count: 5 },
      ]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({
        pendingMaintenance: 3,
      });
      ReportRepository.getCounts.mockResolvedValue({
        users: 10,
        trucks: 5,
        trips: 20
      });
      ReportRepository.getFuelStats.mockResolvedValue([
        { _id: { month: 1 }, totalFuel: 100 }
      ]);
      ReportRepository.getMaintenanceCostStats.mockResolvedValue([
        { _id: "Pneus", totalCost: 500 }
      ]);

      const result = await reportService.getDashboardStats();

      expect(ReportRepository.getTripStats).toHaveBeenCalled();
      expect(ReportRepository.getMaintenanceStats).toHaveBeenCalled();
      expect(ReportRepository.getCounts).toHaveBeenCalled();
      expect(ReportRepository.getFuelStats).toHaveBeenCalled();
      expect(ReportRepository.getMaintenanceCostStats).toHaveBeenCalled();

      expect(result).toEqual({
        totalKm: 1000,
        avgConsumption: 20,
        pendingMaintenance: 3,
        users: 10,
        trucks: 5,
        trips: 20,
        fuelChart: { labels: ["Jan"], data: [100] },
        maintenanceChart: { labels: ["Tires"], data: [500] }
      });
    });

    it("handles empty trip stats (no trips)", async () => {
      ReportRepository.getTripStats.mockResolvedValue([]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({
        pendingMaintenance: 0,
      });
      ReportRepository.getCounts.mockResolvedValue({
        users: 0,
        trucks: 0,
        trips: 0
      });
      ReportRepository.getFuelStats.mockResolvedValue([]);
      ReportRepository.getMaintenanceCostStats.mockResolvedValue([]);

      const result = await reportService.getDashboardStats();

      expect(result).toEqual({
        totalKm: 0,
        avgConsumption: 0,
        pendingMaintenance: 0,
        users: 0,
        trucks: 0,
        trips: 0,
        fuelChart: { labels: [], data: [] },
        maintenanceChart: { labels: [], data: [] }
      });
    });

    it("rounds average consumption to 2 decimals", async () => {
      ReportRepository.getTripStats.mockResolvedValue([
        { totalDistance: 456, totalFuel: 123, count: 2 },
      ]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({
        pendingMaintenance: 1,
      });
      ReportRepository.getCounts.mockResolvedValue({});
      ReportRepository.getFuelStats.mockResolvedValue([]);
      ReportRepository.getMaintenanceCostStats.mockResolvedValue([]);

      const result = await reportService.getDashboardStats();

      expect(result.totalKm).toBe(456);
      expect(result.avgConsumption).toBe(26.97);
      expect(result.pendingMaintenance).toBe(1);
    });
    it("handles unknown maintenance types", async () => {
      ReportRepository.getTripStats.mockResolvedValue([]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({});
      ReportRepository.getCounts.mockResolvedValue({});
      ReportRepository.getFuelStats.mockResolvedValue([]);

      ReportRepository.getMaintenanceCostStats.mockResolvedValue([
        { _id: "UnknownType", totalCost: 100 }
      ]);

      const result = await reportService.getDashboardStats();


      expect(result.maintenanceChart.labels).toContain("UnknownType");
      expect(result.maintenanceChart.data).toContain(100);
    });
  });
});
