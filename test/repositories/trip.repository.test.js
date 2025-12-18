import TripRepository from "../../src/repositories/trip.repository.js";
import Trip from "../../src/models/trip.model.js";

jest.mock("../../src/models/trip.model.js", () => ({
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
}));

describe("TripRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        it("finds all trips with population and pagination", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            Trip.find.mockReturnValue(mockFind);
            Trip.countDocuments.mockResolvedValue(0);

            await TripRepository.findAll(1, 10);

            expect(Trip.find).toHaveBeenCalled();
            expect(mockFind.populate).toHaveBeenCalledWith("driverId", expect.any(String));
            expect(mockFind.populate).toHaveBeenCalledWith("truckId", expect.any(String));
            expect(mockFind.populate).toHaveBeenCalledWith("trailerId", expect.any(String));
            expect(mockFind.sort).toHaveBeenCalledWith({ startDate: -1 });
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
        });

        it("uses default pagination", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            Trip.find.mockReturnValue(mockFind);
            Trip.countDocuments.mockResolvedValue(0);

            await TripRepository.findAll();

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });

    describe("findByDriverId", () => {
        it("finds trips by driver id with population", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([]),
            };
            Trip.find.mockReturnValue(mockFind);

            await TripRepository.findByDriverId("d1");

            expect(Trip.find).toHaveBeenCalledWith({ driverId: "d1" });
            expect(mockFind.populate).toHaveBeenCalled();
            expect(mockFind.sort).toHaveBeenCalledWith({ startDate: -1 });
        });
    });

    describe("findByIdPopulated", () => {
        it("finds trip by id with population", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
            };












            mockFind.populate.mockReturnThis();

            mockFind.then = jest.fn((cb) => cb({ id: "1" }));

            Trip.findById.mockReturnValue(mockFind);

            const result = await TripRepository.findByIdPopulated("1");

            expect(Trip.findById).toHaveBeenCalledWith("1");
            expect(mockFind.populate).toHaveBeenCalledTimes(3);
            expect(result).toEqual({ id: "1" });
        });
    });
});
