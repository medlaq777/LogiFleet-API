import VehicleRepository from "../../src/repositories/vehicle.repository.js";

describe("VehicleRepository", () => {
    let mockModel;
    let repository;

    beforeEach(() => {
        mockModel = {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn(),
        };
        repository = new VehicleRepository(mockModel);
    });

    describe("findAll", () => {
        it("finds all items with pagination", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            mockModel.find.mockReturnValue(mockFind);
            mockModel.countDocuments.mockResolvedValue(0);

            const result = await repository.findAll(1, 10);

            expect(mockModel.find).toHaveBeenCalled();
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual({ items: [], total: 0 });
        });

        it("uses default pagination parameters", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };
            mockModel.find.mockReturnValue(mockFind);
            mockModel.countDocuments.mockResolvedValue(0);

            await repository.findAll();

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });

    describe("findById", () => {
        it("finds item by id", async () => {
            const id = "1";
            mockModel.findById.mockResolvedValue({ id });

            const result = await repository.findById(id);

            expect(mockModel.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual({ id });
        });
    });

    describe("create", () => {
        it("creates item", async () => {
            const data = { name: "test" };
            mockModel.create.mockResolvedValue(data);

            const result = await repository.create(data);

            expect(mockModel.create).toHaveBeenCalledWith(data);
            expect(result).toBe(data);
        });
    });

    describe("update", () => {
        it("updates item", async () => {
            const id = "1";
            const data = { name: "new" };
            mockModel.findByIdAndUpdate.mockResolvedValue(data);

            const result = await repository.update(id, data);

            expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {
                new: true,
                runValidators: true,
            });
            expect(result).toBe(data);
        });
    });

    describe("delete", () => {
        it("deletes item", async () => {
            const id = "1";
            mockModel.findByIdAndDelete.mockResolvedValue({});

            await repository.delete(id);

            expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(id);
        });
    });
});
