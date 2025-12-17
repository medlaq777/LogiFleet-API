import AlertRepository from "../../src/repositories/alert.repository.js";
import Alert from "../../src/models/alert.model.js";

jest.mock("../../src/models/alert.model.js", () => ({
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
}));

describe("AlertRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("creates an alert", async () => {
            const data = { type: "Tire" };
            Alert.create.mockResolvedValue(data);

            const result = await AlertRepository.create(data);

            expect(Alert.create).toHaveBeenCalledWith(data);
            expect(result).toBe(data);
        });
    });

    describe("update", () => {
        it("updates an alert", async () => {
            const id = "1";
            const data = { status: "Closed" };
            Alert.findByIdAndUpdate.mockResolvedValue(data);

            const result = await AlertRepository.update(id, data);

            expect(Alert.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
            expect(result).toBe(data);
        });
    });

    describe("findOpenByTruckId", () => {
        it("finds open alerts by truck id", async () => {
            const truckId = "t1";
            const alerts = [{ id: "1" }];
            Alert.find.mockResolvedValue(alerts);

            const result = await AlertRepository.findOpenByTruckId(truckId);

            expect(Alert.find).toHaveBeenCalledWith({ truckId });
            expect(result).toBe(alerts);
        });
    });

    describe("findAll", () => {
        it("finds all alerts with pagination and population", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            Alert.find.mockReturnValue(mockFind);
            Alert.countDocuments.mockResolvedValue(0);

            const result = await AlertRepository.findAll(1, 10);

            expect(Alert.find).toHaveBeenCalled();
            expect(mockFind.populate).toHaveBeenCalledWith("truckId");
            expect(mockFind.populate).toHaveBeenCalledWith("tireId");
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(Alert.countDocuments).toHaveBeenCalled();
            expect(result).toEqual({ items: [], total: 0 });
        });

        it("uses default pagination", async () => {
            const mockFind = {
                populate: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            Alert.find.mockReturnValue(mockFind);
            Alert.countDocuments.mockResolvedValue(0);

            await AlertRepository.findAll();

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });
});
