import maintenanceController from "../../src/controllers/maintenance.controller.js";
import MaintenanceService from "../../src/services/maintenance.service.js";

jest.mock("../../src/services/maintenance.service.js", () => ({
    getRules: jest.fn(),
    getAlerts: jest.fn(),
    updateAlert: jest.fn(),
    updateRule: jest.fn(),
}));

describe("MaintenanceController", () => {
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

    describe("getRules", () => {
        it("calls service.getRules and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            MaintenanceService.getRules.mockResolvedValue({ items: [], total: 0 });

            await maintenanceController.getRules(req, res, next);

            expect(MaintenanceService.getRules).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            MaintenanceService.getRules.mockRejectedValue(new Error("Fail"));
            await maintenanceController.getRules(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getAlerts", () => {
        it("calls service.getAlerts and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            MaintenanceService.getAlerts.mockResolvedValue({ items: [], total: 0 });

            await maintenanceController.getAlerts(req, res, next);

            expect(MaintenanceService.getAlerts).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            MaintenanceService.getAlerts.mockRejectedValue(new Error("Fail"));
            await maintenanceController.getAlerts(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateAlert", () => {
        it("calls service.updateAlert and returns 200", async () => {
            req.params.id = "1";
            req.body = { status: "resolved" };
            MaintenanceService.updateAlert.mockResolvedValue({ id: "1" });

            await maintenanceController.updateAlert(req, res, next);

            expect(MaintenanceService.updateAlert).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            MaintenanceService.updateAlert.mockRejectedValue(new Error("Fail"));
            await maintenanceController.updateAlert(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateRule", () => {
        it("calls service.updateRule and returns 200", async () => {
            req.body = { ruleName: "new" };
            MaintenanceService.updateRule.mockResolvedValue({ ruleName: "new" });

            await maintenanceController.updateRule(req, res, next);

            expect(MaintenanceService.updateRule).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { ruleName: "new" } });
        });
        it("calls next with error", async () => {
            MaintenanceService.updateRule.mockRejectedValue(new Error("Fail"));
            await maintenanceController.updateRule(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
