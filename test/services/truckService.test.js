import truckService from "../../src/services/truck.service.js";
import TruckRepository from "../../src/repositories/truck.repository.js";

jest.mock("../../src/repositories/truck.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByLicensePlate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("TruckService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTrucks", () => {
    it("returns all trucks", async () => {
      const trucks = [{ id: "1" }, { id: "2" }];
      TruckRepository.findAll.mockResolvedValue(trucks);

      const result = await truckService.getAllTrucks();

      expect(TruckRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(trucks);
    });
  });

  describe("findById", () => {
    it("returns a truck by id", async () => {
      const truck = { id: "1" };
      TruckRepository.findById.mockResolvedValue(truck);

      const result = await truckService.findById("1");

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toBe(truck);
    });
  });

  describe("createTruck", () => {
    it("throws 400 when required fields are missing", async () => {
      const payload = { licensePlate: "", make: "", model: "" };

      await expect(truckService.createTruck(payload)).rejects.toMatchObject({
        message: "license plate, make or model are required",
        status: 400,
      });
    });

    it("throws 409 when truck with same license plate exists", async () => {
      const payload = {
        licensePlate: "ABC123",
        make: "Volvo",
        model: "FH",
      };

      TruckRepository.findByLicensePlate.mockResolvedValue({ id: "1" });

      await expect(truckService.createTruck(payload)).rejects.toMatchObject({
        message: "Truck with license plate Already existe",
        status: 409,
      });

      expect(TruckRepository.findByLicensePlate).toHaveBeenCalledWith("ABC123");
    });

    it("creates truck when data is valid and license plate is unique", async () => {
      const payload = {
        licensePlate: "ABC123",
        make: "Volvo",
        model: "FH",
      };
      const created = { id: "1", ...payload };

      TruckRepository.findByLicensePlate.mockResolvedValue(null);
      TruckRepository.create.mockResolvedValue(created);

      const result = await truckService.createTruck(payload);

      expect(TruckRepository.findByLicensePlate).toHaveBeenCalledWith("ABC123");
      expect(TruckRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toBe(created);
    });
  });

  describe("updateTruck", () => {
    it("throws 404 when truck not found", async () => {
      TruckRepository.findById.mockResolvedValue(null);

      await expect(
        truckService.updateTruck("1", { status: "En service" })
      ).rejects.toMatchObject({
        message: "Truk Not Found",
        status: 404,
      });

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.update).not.toHaveBeenCalled();
    });

    it("throws 400 when setting status to 'En service' and no driver assigned", async () => {
      const existing = {
        id: "1",
        driver: null,
        status: "Hors service",
      };
      TruckRepository.findById.mockResolvedValue(existing);

      await expect(
        truckService.updateTruck("1", { status: "En service" })
      ).rejects.toMatchObject({
        message: "Cannot update status without driver assigned",
        status: 400,
      });

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.update).not.toHaveBeenCalled();
    });

    it("updates truck when valid", async () => {
      const existing = {
        id: "1",
        driver: "driver-id",
        status: "Hors service",
      };
      const updateData = { status: "En service" };
      const updated = { ...existing, ...updateData };

      TruckRepository.findById.mockResolvedValue(existing);
      TruckRepository.update.mockResolvedValue(updated);

      const result = await truckService.updateTruck("1", updateData);

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.update).toHaveBeenCalledWith("1", updateData);
      expect(result).toBe(updated);
    });
  });

  describe("deleteTruck", () => {
    it("throws 404 when truck not found", async () => {
      TruckRepository.findById.mockResolvedValue(null);

      await expect(truckService.deleteTruck("1")).rejects.toMatchObject({
        message: "Truk Not Found",
        status: 404,
      });

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.delete).not.toHaveBeenCalled();
    });

    it("throws 400 when truck is in service", async () => {
      const existing = {
        id: "1",
        status: "En service",
      };
      TruckRepository.findById.mockResolvedValue(existing);

      await expect(truckService.deleteTruck("1")).rejects.toMatchObject({
        message: "Cannot delete truck in service",
        status: 400,
      });

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.delete).not.toHaveBeenCalled();
    });

    it("deletes truck when not in service", async () => {
      const existing = {
        id: "1",
        status: "Hors service",
      };
      TruckRepository.findById.mockResolvedValue(existing);
      TruckRepository.delete.mockResolvedValue(true);

      const result = await truckService.deleteTruck("1");

      expect(TruckRepository.findById).toHaveBeenCalledWith("1");
      expect(TruckRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });
});
