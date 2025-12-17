import trailerController from "../../src/controllers/trailer.controller.js";
import TrailerService from "../../src/services/trailer.service.js";

jest.mock("../../src/services/trailer.service.js", () => ({
    createTrailer: jest.fn(),
    getAllTrailers: jest.fn(),
    updateTrailer: jest.fn(),
    deleteTrailer: jest.fn(),
}));

describe("TrailerController", () => {
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

    describe("createTrailer", () => {
        it("calls service.createTrailer and returns 201", async () => {
            req.body = { capacity: 100 };
            TrailerService.createTrailer.mockResolvedValue({ id: "1" });

            await trailerController.createTrailer(req, res, next);

            expect(TrailerService.createTrailer).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            TrailerService.createTrailer.mockRejectedValue(new Error("Fail"));
            await trailerController.createTrailer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getAllTrailers", () => {
        it("calls service.getAllTrailers and returns 200", async () => {
            req.query = { page: "1", limit: "10" };
            TrailerService.getAllTrailers.mockResolvedValue({ items: [], total: 0 });

            await trailerController.getAllTrailers(req, res, next);

            expect(TrailerService.getAllTrailers).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 0, data: [] });
        });
        it("calls next with error", async () => {
            TrailerService.getAllTrailers.mockRejectedValue(new Error("Fail"));
            await trailerController.getAllTrailers(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateTrailer", () => {
        it("calls service.updateTrailer and returns 200", async () => {
            req.params.id = "1";
            req.body = { capacity: 200 };
            TrailerService.updateTrailer.mockResolvedValue({ id: "1", capacity: 200 });

            await trailerController.updateTrailer(req, res, next);

            expect(TrailerService.updateTrailer).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1", capacity: 200 } });
        });
        it("calls next with error", async () => {
            TrailerService.updateTrailer.mockRejectedValue(new Error("Fail"));
            await trailerController.updateTrailer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteTrailer", () => {
        it("calls service.deleteTrailer and returns 200", async () => {
            req.params.id = "1";
            TrailerService.deleteTrailer.mockResolvedValue({});

            await trailerController.deleteTrailer(req, res, next);

            expect(TrailerService.deleteTrailer).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Trailer Was deleted" });
        });
        it("calls next with error", async () => {
            TrailerService.deleteTrailer.mockRejectedValue(new Error("Fail"));
            await trailerController.deleteTrailer(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
