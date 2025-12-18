import UserRepository from "../../src/repositories/user.repository.js";
import userModel from "../../src/models/user.model.js";

jest.mock("../../src/models/user.model.js", () => {
    const mock = jest.fn();
    Object.assign(mock, {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        countDocuments: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    });
    return mock;
});

describe("UserRepository", () => {
    let mockSave;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSave = jest.fn();

        userModel.mockImplementation(() => ({
            save: mockSave,
        }));
    });

    describe("create", () => {
        it("creates a user", async () => {
            const userData = { email: "test@test.com" };
            mockSave.mockResolvedValue(userData);

            const result = await UserRepository.create(userData);

            expect(userModel).toHaveBeenCalledWith(userData);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toBe(userData);
        });
    });

    describe("findByEmail", () => {
        it("finds user by email", async () => {
            const email = "test@test.com";
            const mockExec = jest.fn().mockResolvedValue({ email });
            userModel.findOne.mockReturnValue({ exec: mockExec });

            const result = await UserRepository.findByEmail(email);

            expect(userModel.findOne).toHaveBeenCalledWith({ email });
            expect(mockExec).toHaveBeenCalled();
            expect(result).toEqual({ email });
        });
    });

    describe("findById", () => {
        it("finds user by id", async () => {
            const id = "1";
            const mockExec = jest.fn().mockResolvedValue({ id });
            userModel.findById.mockReturnValue({ exec: mockExec });

            const result = await UserRepository.findById(id);

            expect(userModel.findById).toHaveBeenCalledWith(id);
            expect(mockExec).toHaveBeenCalled();
            expect(result).toEqual({ id });
        });
    });

    describe("findAll", () => {
        it("finds all users with pagination", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            };
            userModel.find.mockReturnValue(mockFind);
            userModel.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

            await UserRepository.findAll(1, 10);

            expect(userModel.find).toHaveBeenCalled();
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(userModel.countDocuments).toHaveBeenCalled();
        });

        it("uses default pagination parameters", async () => {
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            };
            userModel.find.mockReturnValue(mockFind);
            userModel.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

            await UserRepository.findAll();

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });

    describe("findByRole", () => {
        it("finds users by role with pagination", async () => {
            const role = "admin";
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            };
            userModel.find.mockReturnValue(mockFind);
            userModel.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

            await UserRepository.findByRole(role, 1, 10);

            expect(userModel.find).toHaveBeenCalledWith({ role });
        });

        it("uses default parameters", async () => {
            const role = "admin";
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            };
            userModel.find.mockReturnValue(mockFind);
            userModel.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

            await UserRepository.findByRole(role);

            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(5);
        });
    });

    describe("emailExists", () => {
        it("returns true if email exists", async () => {
            const email = "test";
            userModel.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });

            const result = await UserRepository.emailExists(email);

            expect(result).toBe(true);
        });
    });

    describe("update", () => {
        it("updates user", async () => {
            const id = "1";
            const data = { name: "new" };
            userModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(data) });

            const result = await UserRepository.update(id, data);

            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
            expect(result).toBe(data);
        });
    });

    describe("delete", () => {
        it("deletes user", async () => {
            const id = "1";
            userModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });

            await UserRepository.delete(id);

            expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(id);
        });
    });
});
