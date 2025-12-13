import tireService from "../../src/services/tire.service.js";
import TireRepository from "../../src/repositories/tire.repository.js";
import MaintenanceRepository from "../../src/repositories/maintenance.repository.js";

jest.mock("../../src/repositories/tire.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySerialNumber: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../src/repositories/maintenance.repository.js", () => ({
  __esModule: true,
  default: {
    findByType: jest.fn(),
  },
}));

describe("TireService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTire", () => {
    it("returns all tires", async () => {
      const tires = [{ id: "1" }, { id: "2" }];
      TireRepository.findAll.mockResolvedValue(tires);

      const result = await tireService.getAllTire();

      expect(TireRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(tires);
    });
  });

  describe("createTire", () => {
    it("throws 400 when required fields are missing", async () => {
      const bad = { serialNumber: "", brand: "", type: "", expectedLife: null };

      await expect(tireService.createTire(bad)).rejects.toMatchObject({
        message: "Serial Number, brand, type and expected life are required",
        status: 400,
      });
    });

    it("throws 409 when tire with same serial number exists", async () => {
      const payload = {
        serialNumber: "SN123",
        brand: "Michelin",
        type: "Summer",
        expectedLife: 50000,
      };
      TireRepository.findBySerialNumber.mockResolvedValue({ id: "1" });

      await expect(tireService.createTire(payload)).rejects.toMatchObject({
        message: "Tire with serial number Already existe",
        status: 409,
      });

      expect(TireRepository.findBySerialNumber).toHaveBeenCalledWith("SN123");
    });

    it("creates tire when data is valid and serial is unique", async () => {
      const payload = {
        serialNumber: "SN123",
        brand: "Michelin",
        type: "Summer",
        expectedLife: 50000,
      };
      const created = { id: "1", ...payload };

      TireRepository.findBySerialNumber.mockResolvedValue(null);
      TireRepository.create.mockResolvedValue(created);

      const result = await tireService.createTire(payload);

      expect(TireRepository.findBySerialNumber).toHaveBeenCalledWith("SN123");
      expect(TireRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toBe(created);
    });
  });

  describe("updateTire", () => {
    it("throws 404 when tire not found", async () => {
      TireRepository.findById.mockResolvedValue(null);

      await expect(
        tireService.updateTire("1", { expectedLife: 60000 })
      ).rejects.toMatchObject({
        message: "Tire Not Found",
        status: 404,
      });

      expect(TireRepository.findById).toHaveBeenCalledWith("1");
      expect(TireRepository.update).not.toHaveBeenCalled();
    });

    it("updates tire when found", async () => {
      const existing = { id: "1", expectedLife: 50000 };
      const updateData = { expectedLife: 60000 };
      const updated = { ...existing, ...updateData };

      TireRepository.findById.mockResolvedValue(existing);
      TireRepository.update.mockResolvedValue(updated);

      const result = await tireService.updateTire("1", updateData);

      expect(TireRepository.findById).toHaveBeenCalledWith("1");
      expect(TireRepository.update).toHaveBeenCalledWith("1", updateData);
      expect(result).toBe(updated);
    });
  });

  describe("deleteTire", () => {
    it("throws 404 when tire not found", async () => {
      TireRepository.findById.mockResolvedValue(null);

      await expect(tireService.deleteTire("1")).rejects.toMatchObject({
        message: "Tire Not Found",
        status: 404,
      });

      expect(TireRepository.findById).toHaveBeenCalledWith("1");
      expect(TireRepository.delete).not.toHaveBeenCalled();
    });

    it("deletes tire when found", async () => {
      const existing = { id: "1" };
      TireRepository.findById.mockResolvedValue(existing);
      TireRepository.delete.mockResolvedValue(true);

      const result = await tireService.deleteTire("1");

      expect(TireRepository.findById).toHaveBeenCalledWith("1");
      expect(TireRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("checkMaintenance", () => {
    it("throws 404 when tire not found", async () => {
      TireRepository.findById.mockResolvedValue(null);

      await expect(tireService.checkMaintenance("1")).rejects.toMatchObject({
        message: "Tire Not Found",
        status: 404,
      });

      expect(TireRepository.findById).toHaveBeenCalledWith("1");
    });

    it("returns Critical when current mileage >= expectedLife", async () => {
      const tire = {
        _id: "1",
        serialNumber: "SN123",
        currentMileageOnTire: 60000,
        expectedLife: 50000,
      };
      TireRepository.findById.mockResolvedValue(tire);
      MaintenanceRepository.findByType.mockResolvedValue({
        type: "Pneus",
        intervalKm: 30000,
      });

      const result = await tireService.checkMaintenance("1");

      expect(MaintenanceRepository.findByType).toHaveBeenCalledWith("Pneus");
      expect(result).toMatchObject({
        tireId: "1",
        serialNumber: "SN123",
        currentMileage: 60000,
        expectedLife: 50000,
        maintenanceInterval: 30000,
        status: "Critical: Expected Life Exceeded",
      });
    });

    it("returns Maintenance Needed when mileage >= rule interval but < expectedLife", async () => {
      const tire = {
        _id: "1",
        serialNumber: "SN123",
        currentMileageOnTire: 35000,
        expectedLife: 50000,
      };
      TireRepository.findById.mockResolvedValue(tire);
      MaintenanceRepository.findByType.mockResolvedValue({
        type: "Pneus",
        intervalKm: 30000,
      });

      const result = await tireService.checkMaintenance("1");

      expect(result).toMatchObject({
        status: "Maintenance Needed",
        maintenanceInterval: 30000,
      });
    });

    it("returns Good when mileage < rule interval and < expectedLife", async () => {
      const tire = {
        _id: "1",
        serialNumber: "SN123",
        currentMileageOnTire: 10000,
        expectedLife: 50000,
      };
      TireRepository.findById.mockResolvedValue(tire);
      MaintenanceRepository.findByType.mockResolvedValue({
        type: "Pneus",
        intervalKm: 30000,
      });

      const result = await tireService.checkMaintenance("1");

      expect(result).toMatchObject({
        status: "Good",
        maintenanceInterval: 30000,
      });
    });

    it("handles missing maintenance rule (returns N/A interval)", async () => {
      const tire = {
        _id: "1",
        serialNumber: "SN123",
        currentMileageOnTire: 10000,
        expectedLife: 50000,
      };
      TireRepository.findById.mockResolvedValue(tire);
      MaintenanceRepository.findByType.mockResolvedValue(null);

      const result = await tireService.checkMaintenance("1");

      expect(MaintenanceRepository.findByType).toHaveBeenCalledWith("Pneus");
      expect(result).toMatchObject({
        status: "Good",
        maintenanceInterval: "N/A",
      });
    });
  });
});
