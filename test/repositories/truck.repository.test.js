import TruckRepository from "../../src/repositories/truck.repository.js";
import Truck from "../../src/models/trucks.model.js";

jest.mock("../../src/models/trucks.model.js", () => ({
    find: jest.fn(),
    findOne: jest.fn(),
}));

describe("TruckRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAvailable", () => {
        it("finds available trucks", async () => {
            const trucks = [{ id: "1" }];
            Truck.find.mockResolvedValue(trucks);

            const result = await TruckRepository.findAvailable();

            expect(Truck.find).toHaveBeenCalledWith({ status: "Disponible" });
            expect(result).toBe(trucks);
        });
    });

    describe("findByLicensePlate", () => {
        it("finds truck by license plate", async () => {
            const plate = "PL123";
            Truck.findOne.mockResolvedValue({ licensePlate: plate });

            const result = await TruckRepository.findByLicensePlate(plate);

            expect(Truck.findOne).toHaveBeenCalledWith({ licensePlate: plate });
            expect(result).toEqual({ licensePlate: plate });
        });
    });
});
