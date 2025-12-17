import tireController from "../../src/controllers/tire.controller.js";
import TireService from "../../src/services/tire.service.js";

jest.mock("../../src/services/tire.service.js", () => ({
    createTire: jest.fn(),
    getAllTire: jest.fn(),
    updateTire: jest.fn(),
    deleteTire: jest.fn(),
    checkMaintenance: jest.fn(),
}));

describe("TireController", () => {
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

    describe("createTire", () => {
        it("calls service.createTire and returns 201", async () => {
            req.body = { serial: "123" };
            TireService.createTire.mockResolvedValue({ id: "1" });

            await tireController.createTire(req, res, next);

            expect(TireService.createTire).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            TireService.createTire.mockRejectedValue(new Error("Fail"));
            await tireController.createTire(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getAllTire", () => {
        it("calls service.getAllTire and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            TireService.getAllTire.mockResolvedValue({ items: [], total: 0 });

            await tireController.getAllTire(req, res, next);

            expect(TireService.getAllTire).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            TireService.getAllTire.mockRejectedValue(new Error("Fail"));
            await tireController.getAllTire(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateTire", () => {
        it("calls service.updateTire and returns 200", async () => {
            req.params.id = "1";
            req.body = { brand: "new" };
            TireService.updateTire.mockResolvedValue({ id: "1", brand: "new" });

            await tireController.updateTire(req, res, next);

            expect(TireService.updateTire).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1", brand: "new" } });
        });
        it("calls next with error", async () => {
            TireService.updateTire.mockRejectedValue(new Error("Fail"));
            await tireController.updateTire(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteTire", () => {
        it("calls service.deleteTire and returns 200", async () => {
            req.params.id = "1";
            TireService.deleteTire.mockResolvedValue({});

            await tireController.deleteTire(req, res, next);

            expect(TireService.deleteTire).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Tire was deleted" });
        });
        it("calls next with error", async () => {
            TireService.deleteTire.mockRejectedValue(new Error("Fail"));
            await tireController.deleteTire(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("checkMaintenance", () => {
        it("calls service.checkMaintenance and returns 200", async () => {
            req.params.id = "1";
            TireService.checkMaintenance.mockResolvedValue({ status: "ok" });

            await tireController.checkMaintenance(req, res, next);

            expect(TireService.checkMaintenance).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { status: "ok" } });
        });
        it("calls next with error", async () => {
            TireService.checkMaintenance.mockRejectedValue(new Error("Fail"));
            await tireController.checkMaintenance(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
