import reportController from "../../src/controllers/report.controller.js";
import ReportService from "../../src/services/report.service.js";

jest.mock("../../src/services/report.service.js", () => ({
    getDashboardStats: jest.fn(),
}));

describe("ReportController", () => {
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

    describe("getStats", () => {
        it("calls service.getDashboardStats and returns 200", async () => {
            ReportService.getDashboardStats.mockResolvedValue({ some: "stats" });

            await reportController.getStats(req, res, next);

            expect(ReportService.getDashboardStats).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { some: "stats" } });
        });

        it("calls next with error", async () => {
            ReportService.getDashboardStats.mockRejectedValue(new Error("Fail"));
            await reportController.getStats(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
