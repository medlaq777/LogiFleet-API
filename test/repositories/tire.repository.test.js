import TireRepository from "../../src/repositories/tire.repository.js";
import Tire from "../../src/models/tire.model.js";

jest.mock("../../src/models/tire.model.js", () => ({
    findOne: jest.fn(),
    create: jest.fn(), // inherited
    findById: jest.fn(), // inherited
}));

describe("TireRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findBySerialNumber", () => {
        it("finds tire by serial number", async () => {
            const serialNumber = "SN123";
            Tire.findOne.mockResolvedValue({ serialNumber });

            const result = await TireRepository.findBySerialNumber(serialNumber);

            expect(Tire.findOne).toHaveBeenCalledWith({ serialNumber });
            expect(result).toEqual({ serialNumber });
        });
    });
});
