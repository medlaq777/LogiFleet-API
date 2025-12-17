import truckController from "../../src/controllers/truck.controller.js";
import TruckService from "../../src/services/truck.service.js";

jest.mock("../../src/services/truck.service.js", () => ({
    createTruck: jest.fn(),
    getAllTrucks: jest.fn(),
    updateTruck: jest.fn(),
    deleteTruck: jest.fn(),
}));

describe("TruckController", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("createTruck", () => {
        it("calls service.createTruck and returns 201", async () => {
            req.body = { plate: "AAA" };
            TruckService.createTruck.mockResolvedValue({ id: "1" });

            await truckController.createTruck(req, res, next);

            expect(TruckService.createTruck).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            TruckService.createTruck.mockRejectedValue(new Error("Fail"));
            await truckController.createTruck(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getAllTrucks", () => {
        it("calls service.getAllTrucks and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            TruckService.getAllTrucks.mockResolvedValue({ items: [], total: 0 });

            await truckController.getAllTrucks(req, res, next);

            expect(TruckService.getAllTrucks).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            TruckService.getAllTrucks.mockRejectedValue(new Error("Fail"));
            await truckController.getAllTrucks(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateTruck", () => {
        it("calls service.updateTruck and returns 200", async () => {
            req.params.id = "1";
            req.body = { model: "New" };
            TruckService.updateTruck.mockResolvedValue({ id: "1", model: "New" });

            await truckController.updateTruck(req, res, next);

            expect(TruckService.updateTruck).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1", model: "New" } });
        });
        it("calls next with error", async () => {
            TruckService.updateTruck.mockRejectedValue(new Error("Fail"));
            await truckController.updateTruck(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteTruck", () => {
        it("calls service.deleteTruck and returns 200", async () => {
            req.params.id = "1";
            TruckService.deleteTruck.mockResolvedValue({});

            await truckController.deleteTruck(req, res, next);

            expect(TruckService.deleteTruck).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Truck Was Deleted" });
        });
        it("calls next with error", async () => {
            TruckService.deleteTruck.mockRejectedValue(new Error("Fail"));
            await truckController.deleteTruck(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
