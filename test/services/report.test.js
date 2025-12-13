import reportService from "../../src/services/report.service.js";
import ReportRepository from "../../src/repositories/report.repository.js";

jest.mock("../../src/repositories/report.repository.js", () => ({
  __esModule: true,
  default: {
    getTripStats: jest.fn(),
    getMaintenanceStats: jest.fn(),
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

      const result = await reportService.getDashboardStats();

      expect(ReportRepository.getTripStats).toHaveBeenCalled();
      expect(ReportRepository.getMaintenanceStats).toHaveBeenCalled();

      expect(result).toEqual({
        totalKm: 1000,
        avgConsumption: 20, // (200 / 1000) * 100
        pendingMaintenance: 3,
      });
    });

    it("handles empty trip stats (no trips)", async () => {
      ReportRepository.getTripStats.mockResolvedValue([]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({
        pendingMaintenance: 0,
      });

      const result = await reportService.getDashboardStats();

      expect(result).toEqual({
        totalKm: 0,
        avgConsumption: 0,
        pendingMaintenance: 0,
      });
    });

    it("rounds average consumption to 2 decimals", async () => {
      ReportRepository.getTripStats.mockResolvedValue([
        { totalDistance: 456, totalFuel: 123, count: 2 },
      ]);
      ReportRepository.getMaintenanceStats.mockResolvedValue({
        pendingMaintenance: 1,
      });

      const result = await reportService.getDashboardStats();

      expect(result.totalKm).toBe(456);
      expect(result.avgConsumption).toBe(26.97);
      expect(result.pendingMaintenance).toBe(1);
    });
  });
});
