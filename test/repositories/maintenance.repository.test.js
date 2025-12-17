import MaintenanceRepository from "../../src/repositories/maintenance.repository.js";
import MaintenanceRule from "../../src/models/maintenanceRule.model.js";

jest.mock("../../src/models/maintenanceRule.model.js", () => ({
    find: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
}));

describe("MaintenanceRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        it("finds all rules with pagination", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            MaintenanceRule.find.mockReturnValue(mockFind);
            MaintenanceRule.countDocuments.mockResolvedValue(0);

            const result = await MaintenanceRepository.findAll(1, 10);

            expect(MaintenanceRule.find).toHaveBeenCalled();
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual({ items: [], total: 0 });
        });

        it("uses default pagination", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            MaintenanceRule.find.mockReturnValue(mockFind);
            MaintenanceRule.countDocuments.mockResolvedValue(0);

            await MaintenanceRepository.findAll();

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });

    describe("findByType", () => {
        it("finds rule by type", async () => {
            const type = "Oil";
            MaintenanceRule.findOne.mockResolvedValue({ type });

            const result = await MaintenanceRepository.findByType(type);

            expect(MaintenanceRule.findOne).toHaveBeenCalledWith({ type });
            expect(result).toEqual({ type });
        });
    });

    describe("updateRule", () => {
        it("updates rule by type with upsert", async () => {
            const type = "Oil";
            const data = { threshold: 1000 };
            MaintenanceRule.findOneAndUpdate.mockResolvedValue(data);

            const result = await MaintenanceRepository.updateRule(type, data);

            expect(MaintenanceRule.findOneAndUpdate).toHaveBeenCalledWith(
                { type },
                data,
                { new: true, upsert: true }
            );
            expect(result).toEqual(data);
        });
    });
});
