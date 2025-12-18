import tripService from "../../src/services/trip.service.js";
import TripRepository from "../../src/repositories/trip.repository.js";
import TruckService from "../../src/services/truck.service.js";
import PdfGenerator from "../../src/utils/pdf.util.js";
import MaintenanceRepository from "../../src/repositories/maintenance.repository.js";
import AlertRepository from "../../src/repositories/alert.repository.js";

jest.mock("../../src/repositories/trip.repository.js", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByDriverId: jest.fn(),
    findByIdPopulated: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../src/services/truck.service.js", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    updateTruck: jest.fn(),
  },
}));

jest.mock("../../src/services/tire.service.js", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("../../src/utils/pdf.util.js", () => ({
  __esModule: true,
  default: {
    generateMissionOrder: jest.fn(),
  },
}));

jest.mock("../../src/repositories/maintenance.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    getAllRules: jest.fn(),
  },
}));

jest.mock("../../src/repositories/alert.repository.js", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe("TripService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTrips", () => {
    it("returns all trips", async () => {
      const trips = [{ id: "t1" }, { id: "t2" }];
      TripRepository.findAll.mockResolvedValue(trips);

      const result = await tripService.getAllTrips();

      expect(TripRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(trips);
    });
  });

  describe("createTrip", () => {
    it("throws 400 when truckId is missing", async () => {
      const data = { destination: "City" };
      const adminId = "admin1";

      await expect(tripService.createTrip(data, adminId)).rejects.toMatchObject(
        {
          message: "Truck ID is required",
          status: 400,
        }
      );
    });

    it("throws 404 when truck not found", async () => {
      TruckService.findById.mockResolvedValue(null);

      const data = { truckId: "truck1", destination: "City" };
      const adminId = "admin1";

      await expect(tripService.createTrip(data, adminId)).rejects.toMatchObject(
        {
          message: "Truck not found",
          status: 404,
        }
      );

      expect(TruckService.findById).toHaveBeenCalledWith("truck1");
      expect(TripRepository.create).not.toHaveBeenCalled();
    });

    it("throws 400 when truck not available", async () => {
      TruckService.findById.mockResolvedValue({
        _id: "truck1",
        status: "En service",
      });

      const data = { truckId: "truck1", destination: "City" };
      const adminId = "admin1";

      await expect(tripService.createTrip(data, adminId)).rejects.toMatchObject(
        {
          message: "Truck not available",
          status: 400,
        }
      );

      expect(TruckService.findById).toHaveBeenCalledWith("truck1");
      expect(TripRepository.create).not.toHaveBeenCalled();
    });

    it("creates trip when truck is available", async () => {
      TruckService.findById.mockResolvedValue({
        _id: "truck1",
        status: "Disponible",
      });

      const data = { truckId: "truck1", destination: "City" };
      const adminId = "admin1";
      const createdTrip = { id: "trip1", ...data, adminId };

      TripRepository.create.mockResolvedValue(createdTrip);

      const result = await tripService.createTrip(data, adminId);

      expect(TruckService.findById).toHaveBeenCalledWith("truck1");
      expect(TripRepository.create).toHaveBeenCalledWith({
        ...data,
        adminId,
      });
      expect(result).toBe(createdTrip);
    });
  });

  describe("getDriverTrips", () => {
    it("returns trips for driver", async () => {
      const trips = [{ id: "t1" }, { id: "t2" }];
      TripRepository.findByDriverId.mockResolvedValue(trips);

      const result = await tripService.getDriverTrips("driver1");

      expect(TripRepository.findByDriverId).toHaveBeenCalledWith("driver1");
      expect(result).toBe(trips);
    });
  });

  describe("updateTrip", () => {
    it("throws 404 when trip not found", async () => {
      TripRepository.findById.mockResolvedValue(null);
      await expect(tripService.updateTrip("trip1", {})).rejects.toMatchObject({
        message: "Trip not found",
        status: 404
      });
    });

    it("updates trip when found", async () => {
      const trip = { id: "trip1" };
      const updateData = { destination: "New City" };
      const updatedTrip = { ...trip, ...updateData };

      TripRepository.findById.mockResolvedValue(trip);
      TripRepository.update.mockResolvedValue(updatedTrip);

      const result = await tripService.updateTrip("trip1", updateData);
      expect(TripRepository.update).toHaveBeenCalledWith("trip1", updateData);
      expect(result).toBe(updatedTrip);
    });
  });

  describe("deleteTrip", () => {
    it("throws 404 when trip not found", async () => {
      TripRepository.findById.mockResolvedValue(null);
      await expect(tripService.deleteTrip("trip1")).rejects.toMatchObject({
        message: "Trip not found",
        status: 404
      });
    });

    it("deletes trip when found", async () => {
      const trip = { id: "trip1" };
      TripRepository.findById.mockResolvedValue(trip);
      TripRepository.delete.mockResolvedValue(true);

      const result = await tripService.deleteTrip("trip1");
      expect(TripRepository.delete).toHaveBeenCalledWith("trip1");
      expect(result).toBe(true);
    });
  });

  describe("updateTripStatus", () => {
    it("throws 404 when trip not found", async () => {
      TripRepository.findByIdPopulated.mockResolvedValue(null);

      await expect(
        tripService.updateTripStatus("trip1", "driver1", { status: "En cours" })
      ).rejects.toMatchObject({
        message: "Trip Not found",
        status: 404,
      });

      expect(TripRepository.update).not.toHaveBeenCalled();
    });

    it("throws 403 when driver does not own trip", async () => {
      TripRepository.findByIdPopulated.mockResolvedValue({
        _id: "trip1",
        driverId: { _id: "otherDriver" },
        status: "En attente",
      });

      await expect(
        tripService.updateTripStatus("trip1", "driver1", { status: "En cours" })
      ).rejects.toMatchObject({
        message: "Cannot access this Trip",
        status: 403,
      });

      expect(TripRepository.update).not.toHaveBeenCalled();
    });

    it("updates status without finalizing when not 'Terminé'", async () => {
      const trip = {
        _id: "trip1",
        driverId: { _id: "driver1" },
        status: "En attente",
        truckId: { _id: "truck1", currentMileage: 1000 },
      };
      TripRepository.findByIdPopulated.mockResolvedValue(trip);

      const updateData = { status: "En cours" };
      const updatedTrip = { ...trip, ...updateData };
      TripRepository.update.mockResolvedValue(updatedTrip);

      const result = await tripService.updateTripStatus(
        "trip1",
        "driver1",
        updateData
      );

      expect(TripRepository.findByIdPopulated).toHaveBeenCalledWith("trip1");
      expect(TripRepository.update).toHaveBeenCalledWith("trip1", updateData);
      expect(TruckService.updateTruck).not.toHaveBeenCalled();
      expect(AlertRepository.create).not.toHaveBeenCalled();
      expect(result).toBe(updatedTrip);
    });

    it("finalizes trip and creates maintenance alert when crossing interval", async () => {
      const trip = {
        _id: "trip1",
        driverId: { _id: "driver1" },
        status: "En cours",
        truckId: { _id: "truck1", currentMileage: 1000 },
        startMileage: 1000,
      };
      TripRepository.findByIdPopulated.mockResolvedValue(trip);

      const updateData = { status: "Terminé", endMileage: 1500, startMileage: 1000 };
      const updatedTrip = { ...trip, ...updateData };
      TripRepository.update.mockResolvedValue(updatedTrip);

      MaintenanceRepository.getAllRules.mockResolvedValue([
        { type: "Vidange", intervalKm: 400 },
      ]);

      const result = await tripService.updateTripStatus(
        "trip1",
        "driver1",
        updateData
      );

      expect(TruckService.updateTruck).toHaveBeenCalledWith("truck1", {
        currentMileage: 1500,
      });
      expect(MaintenanceRepository.getAllRules).toHaveBeenCalled();

      expect(AlertRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          truckId: "truck1",
          type: "Maintenance",
          message: expect.stringContaining("Vidange"),
        })
      );

      expect(TripRepository.update).toHaveBeenCalledWith("trip1", updateData);
      expect(result).toBe(updatedTrip);
    });
  });

  describe("_finalizeTrip (internal)", () => {
    it("throws 400 when endMileage is missing", async () => {
      const trip = {
        truckId: { _id: "truck1", currentMileage: 1000 },
      };

      await expect(tripService._finalizeTrip(trip, {})).rejects.toMatchObject({
        message: "Required End Mileage for complete the trip ",
        status: 400,
      });
    });

    it("throws 400 when mileage distance is negative", async () => {
      const trip = {
        truckId: { _id: "truck1", currentMileage: 2000 },
        startMileage: 2000,
      };

      await expect(
        tripService._finalizeTrip(trip, { endMileage: 1500, startMileage: 2000 })
      ).rejects.toMatchObject({
        message: "Mileage inconsistency",
        status: 400,
      });
    });

    it("allows trip completion when truck mileage is ahead of trip (Fix Scenario)", async () => {
      const trip = {
        truckId: { _id: "truck1", currentMileage: 1500 },
        startMileage: 1000,
      };




      const data = { endMileage: 1200, startMileage: 1000 };

      await tripService._finalizeTrip(trip, data);

      expect(TruckService.updateTruck).not.toHaveBeenCalled();
    });

    it("updates truck mileage but skips maintenance when repositories are missing", async () => {
      const trip = {
        truckId: { _id: "truck1", currentMileage: 1000 },
        startMileage: 1000,
      };

      const data = { endMileage: 1500, startMileage: 1000 };

      const originalMaintenanceRepo = tripService.maintenanceRepository;
      const originalAlertRepo = tripService.alertRepository;

      tripService.maintenanceRepository = null;
      tripService.alertRepository = null;

      await tripService._finalizeTrip(trip, data);

      expect(TruckService.updateTruck).toHaveBeenCalledWith("truck1", {
        currentMileage: 1500,
      });
      expect(MaintenanceRepository.getAllRules).not.toHaveBeenCalled();
      expect(AlertRepository.create).not.toHaveBeenCalled();

      tripService.maintenanceRepository = originalMaintenanceRepo;
      tripService.alertRepository = originalAlertRepo;
    });

    it("does not create maintenance alert when interval is not crossed", async () => {
      const trip = {
        truckId: { _id: "truck1", currentMileage: 1000 },
        startMileage: 1000,
      };

      const data = { endMileage: 1500, startMileage: 1000 };

      MaintenanceRepository.getAllRules.mockResolvedValue([
        { type: "Vidange", intervalKm: 1000 },
      ]);

      await tripService._finalizeTrip(trip, data);

      expect(TruckService.updateTruck).toHaveBeenCalledWith("truck1", {
        currentMileage: 1500,
      });
      expect(AlertRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("generateMissionOrderPdf", () => {
    it("throws 404 when trip not found", async () => {
      TripRepository.findByIdPopulated.mockResolvedValue(null);

      await expect(
        tripService.generateMissionOrderPdf("trip1", "driver1")
      ).rejects.toMatchObject({
        message: "Trip Not Found",
        status: 404,
      });
    });

    it("throws 403 when driver is not authorized", async () => {
      TripRepository.findByIdPopulated.mockResolvedValue({
        _id: "trip1",
        driverId: { _id: "otherDriver" },
      });

      await expect(
        tripService.generateMissionOrderPdf("trip1", "driver1")
      ).rejects.toMatchObject({
        message: "Unauthorized",
        status: 403,
      });
    });

    it("generates mission order pdf when authorized", async () => {
      const trip = {
        _id: "trip1",
        driverId: { _id: "driver1" },
      };
      TripRepository.findByIdPopulated.mockResolvedValue(trip);
      PdfGenerator.generateMissionOrder.mockResolvedValue("PDF_DATA");

      const result = await tripService.generateMissionOrderPdf(
        "trip1",
        "driver1"
      );

      expect(TripRepository.findByIdPopulated).toHaveBeenCalledWith("trip1");
      expect(PdfGenerator.generateMissionOrder).toHaveBeenCalledWith(trip);
      expect(result).toBe("PDF_DATA");
    });
  });
});
