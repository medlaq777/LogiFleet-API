import ReportRepository from "../../src/repositories/report.repository.js";
import Trip from "../../src/models/trip.model.js";
import Alert from "../../src/models/alert.model.js";
import Truck from "../../src/models/trucks.model.js";
import Trailer from "../../src/models/trailer.model.js";

jest.mock("../../src/models/trip.model.js", () => ({
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
}));
jest.mock("../../src/models/alert.model.js", () => ({
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
}));
jest.mock("../../src/models/trucks.model.js", () => ({
    countDocuments: jest.fn(),
}));
jest.mock("../../src/models/trailer.model.js", () => ({
    countDocuments: jest.fn(),
}));

describe("ReportRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTripStats", () => {
        it("aggregates trip stats", async () => {
            Trip.aggregate.mockResolvedValue([]);
            await ReportRepository.getTripStats();
            expect(Trip.aggregate).toHaveBeenCalledWith(expect.any(Array));
            const pipeline = Trip.aggregate.mock.calls[0][0];
            expect(pipeline[0].$match.status).toBe("Terminé");
        });
    });

    describe("getCounts", () => {
        it("returns counts of various entities", async () => {
            Truck.countDocuments.mockResolvedValue(5);
            Trailer.countDocuments.mockResolvedValue(3);
            Trip.countDocuments.mockResolvedValue(2);
            Alert.countDocuments.mockResolvedValue(1);

            const result = await ReportRepository.getCounts();

            expect(Truck.countDocuments).toHaveBeenCalled();
            expect(Trailer.countDocuments).toHaveBeenCalled();
            expect(Trip.countDocuments).toHaveBeenCalledWith({ status: { $in: ["À faire", "En cours"] } });
            expect(Alert.countDocuments).toHaveBeenCalledWith({ type: "Maintenance", status: "Open" });
            expect(result).toEqual({
                totalTrucks: 5,
                totalTrailers: 3,
                activeTrips: 2,
                maintenanceAlerts: 1,
            });
        });
    });

    describe("getMaintenanceStats", () => {
        it("returns pending maintenance count", async () => {
            Alert.countDocuments.mockResolvedValue(5);
            const result = await ReportRepository.getMaintenanceStats();
            expect(Alert.countDocuments).toHaveBeenCalledWith({ type: "Maintenance", status: "Open" });
            expect(result).toEqual({ pendingMaintenance: 5 });
        });
    });

    describe("getFuelStats", () => {
        it("aggregates fuel stats for last 6 months", async () => {
            Trip.aggregate.mockResolvedValue([]);
            await ReportRepository.getFuelStats();
            expect(Trip.aggregate).toHaveBeenCalled();
        });
    });

    describe("getMaintenanceCostStats", () => {
        it("aggregates maintenance cost stats", async () => {
            Alert.aggregate.mockResolvedValue([]);
            await ReportRepository.getMaintenanceCostStats();
            expect(Alert.aggregate).toHaveBeenCalled();
        });
    });
});
