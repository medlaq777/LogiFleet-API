import tripController from "../../src/controllers/trip.controller.js";
import TripService from "../../src/services/trip.service.js";

jest.mock("../../src/services/trip.service.js", () => ({
    getAllTrips: jest.fn(),
    createTrip: jest.fn(),
    getDriverTrips: jest.fn(),
    updateTrip: jest.fn(),
    updateTripStatus: jest.fn(),
    deleteTrip: jest.fn(),
    generateMissionOrderPdf: jest.fn(),
}));

describe("TripController", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {}, user: { _id: "user1", role: "Driver" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("getAllTrips", () => {
        it("calls service.getAllTrips and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            TripService.getAllTrips.mockResolvedValue({ items: [], total: 0 });

            await tripController.getAllTrips(req, res, next);

            expect(TripService.getAllTrips).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ succes: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            TripService.getAllTrips.mockRejectedValue(new Error("Fail"));
            await tripController.getAllTrips(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("createTrip", () => {
        it("calls service.createTrip and returns 201", async () => {
            req.body = { dest: "City" };
            TripService.createTrip.mockResolvedValue({ id: "1" });

            await tripController.createTrip(req, res, next);

            expect(TripService.createTrip).toHaveBeenCalledWith(req.body, "user1");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            TripService.createTrip.mockRejectedValue(new Error("Fail"));
            await tripController.createTrip(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getMyTrips", () => {
        it("calls service.getDriverTrips and returns 200", async () => {
            TripService.getDriverTrips.mockResolvedValue([]);

            await tripController.getMyTrips(req, res, next);

            expect(TripService.getDriverTrips).toHaveBeenCalledWith("user1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            TripService.getDriverTrips.mockRejectedValue(new Error("Fail"));
            await tripController.getMyTrips(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateTrip", () => {
        it("calls updateTripStatus if user is NOT admin", async () => {
            req.user.role = "Driver";
            req.params.id = "trip1";
            req.body = { status: "started" };
            TripService.updateTripStatus.mockResolvedValue({ id: "trip1" });

            await tripController.updateTrip(req, res, next);

            expect(TripService.updateTripStatus).toHaveBeenCalledWith("trip1", "user1", req.body);
            expect(TripService.updateTrip).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "trip1" } });
        });

        it("calls updateTrip if user IS admin", async () => {
            req.user.role = "Admin";
            req.params.id = "trip1";
            req.body = { dest: "New" };
            TripService.updateTrip.mockResolvedValue({ id: "trip1" });

            await tripController.updateTrip(req, res, next);

            expect(TripService.updateTrip).toHaveBeenCalledWith("trip1", req.body);
            expect(TripService.updateTripStatus).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "trip1" } });
        });

        it("calls next with error", async () => {
            TripService.updateTripStatus.mockRejectedValue(new Error("Fail"));
            await tripController.updateTrip(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteTrip", () => {
        it("calls service.deleteTrip and returns 200", async () => {
            req.params.id = "1";
            TripService.deleteTrip.mockResolvedValue({});

            await tripController.deleteTrip(req, res, next);

            expect(TripService.deleteTrip).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Trip deleted successfully" });
        });
        it("calls next with error", async () => {
            TripService.deleteTrip.mockRejectedValue(new Error("Fail"));
            await tripController.deleteTrip(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("downloadMissionOrder", () => {
        it("streams pdf for mission order", async () => {
            req.params.id = "trip1";
            const mockDoc = {
                pipe: jest.fn(),
                end: jest.fn(),
            };
            TripService.generateMissionOrderPdf.mockResolvedValue(mockDoc);

            await tripController.downloadMissionOrder(req, res, next);

            expect(TripService.generateMissionOrderPdf).toHaveBeenCalledWith("trip1", "user1");
            expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
            expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=mission-trip1.pdf");
            expect(mockDoc.pipe).toHaveBeenCalledWith(res);
            expect(mockDoc.end).toHaveBeenCalled();
        });
        it("calls next with error", async () => {
            TripService.generateMissionOrderPdf.mockRejectedValue(new Error("Fail"));
            await tripController.downloadMissionOrder(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
