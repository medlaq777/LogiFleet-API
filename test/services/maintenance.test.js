import maintenanceService from "../../src/services/maintenance.service.js";
import MaintenanceRepository from "../../src/repositories/maintenance.repository.js";
import AlertRepository from "../../src/repositories/alert.repository.js";
import TireRepository from "../../src/repositories/tire.repository.js";

jest.mock("../../src/repositories/maintenance.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    updateRule: jest.fn(),
  },
}));

jest.mock("../../src/repositories/alert.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../src/repositories/tire.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

describe("MaintenanceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRules", () => {
    it("returns all maintenance rules", async () => {
      const rules = [{ type: "Vidange", intervalKm: 10000 }];
      MaintenanceRepository.findAll.mockResolvedValue(rules);

      const result = await maintenanceService.getRules();

      expect(MaintenanceRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(rules);
    });
  });

  describe("getAlerts", () => {
    it("returns all maintenance alerts", async () => {
      const alerts = [{ id: "a1" }, { id: "a2" }];
      AlertRepository.findAll.mockResolvedValue(alerts);

      const result = await maintenanceService.getAlerts();

      expect(AlertRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(alerts);
    });
  });

  describe("updateRule", () => {
    it("throws 400 when type or intervalKm is missing", async () => {
      await expect(
        maintenanceService.updateRule({ type: "Vidange" })
      ).rejects.toMatchObject({
        message: "Type and Interval are required",
        status: 400,
      });

      await expect(
        maintenanceService.updateRule({ intervalKm: 10000 })
      ).rejects.toMatchObject({
        message: "Type and Interval are required",
        status: 400,
      });

      expect(MaintenanceRepository.updateRule).not.toHaveBeenCalled();
    });

    it("updates rule when data is valid", async () => {
      const data = { type: "Vidange", intervalKm: 15000 };
      const updated = { ...data, _id: "rule1" };

      MaintenanceRepository.updateRule.mockResolvedValue(updated);

      const result = await maintenanceService.updateRule(data);

      expect(MaintenanceRepository.updateRule).toHaveBeenCalledWith(
        "Vidange",
        data
      );
      expect(result).toBe(updated);
    });
  });

  describe("checkDailyTires", () => {
    it("does nothing when no tires exceed expected life", async () => {
      const tires = [
        {
          _id: "t1",
          serialNumber: "SN1",
          currentMileageOnTire: 20000,
          expectedLife: 50000,
        },
      ];
      TireRepository.findAll.mockResolvedValue(tires);

      await maintenanceService.checkDailyTires();

      expect(TireRepository.findAll).toHaveBeenCalled();
      expect(AlertRepository.create).not.toHaveBeenCalled();
    });

    it("creates alerts for tires that reached expected life", async () => {
      const tires = [
        {
          _id: "t1",
          serialNumber: "SN1",
          currentMileageOnTire: 60000,
          expectedLife: 50000,
        },
        {
          _id: "t2",
          serialNumber: "SN2",
          currentMileageOnTire: 40000,
          expectedLife: 50000,
        },
      ];
      TireRepository.findAll.mockResolvedValue(tires);

      await maintenanceService.checkDailyTires();

      expect(TireRepository.findAll).toHaveBeenCalled();
      expect(AlertRepository.create).toHaveBeenCalledTimes(1);
      expect(AlertRepository.create).toHaveBeenCalledWith({
        tireId: "t1",
        type: "Pneus",
        message:
          "Tire SN1 reached expected life (50000 km). Replacement required.",
      });
    });

    it("handles empty tire list", async () => {
      TireRepository.findAll.mockResolvedValue([]);

      await maintenanceService.checkDailyTires();

      expect(TireRepository.findAll).toHaveBeenCalled();
      expect(AlertRepository.create).not.toHaveBeenCalled();
    });
  });
});
