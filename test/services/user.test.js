import userService from "../../src/services/user.service.js";
import UserRepository from "../../src/repositories/user.repository.js";
import BcryptUtil from "../../src/utils/bycript.util.js";

jest.mock("../../src/repositories/user.repository.js", () => ({
    __esModule: true,
    default: {
        findByEmail: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        findByRole: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("../../src/utils/bycript.util.js", () => ({
    __esModule: true,
    default: {
        hash: jest.fn(),
    },
}));

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("throws 400 when required fields are missing", async () => {
            const payload = {
                firstName: "",
                lastName: "",
                email: "test@example.com",
                password: "password",
            };
            await expect(userService.createUser(payload)).rejects.toMatchObject({
                message: "Missing required fields",
                status: 400,
            });
        });

        it("throws 409 when user already exists", async () => {
            const payload = {
                firstName: "John",
                lastName: "Doe",
                email: "test@example.com",
                password: "password",
            };
            UserRepository.findByEmail.mockResolvedValue({ id: "1" });

            await expect(userService.createUser(payload)).rejects.toMatchObject({
                message: "User already exists",
                status: 409,
            });
        });

        it("creates user with default role 'Driver' if not provided", async () => {
            const payload = {
                firstName: "John",
                lastName: "Doe",
                email: "test@example.com",
                password: "password",
            };
            UserRepository.findByEmail.mockResolvedValue(null);
            BcryptUtil.hash.mockResolvedValue("hashedPassword");

            const createdUser = {
                ...payload,
                password: "hashedPassword",
                role: "Driver",
                toObject: () => ({ ...payload, password: "hashedPassword", role: "Driver" })
            };
            UserRepository.create.mockResolvedValue(createdUser);

            const result = await userService.createUser(payload);

            expect(BcryptUtil.hash).toHaveBeenCalledWith("password", 10);
            expect(UserRepository.create).toHaveBeenCalledWith({
                firstName: "John",
                lastName: "Doe",
                email: "test@example.com",
                password: "hashedPassword",
                role: "Driver"
            });
            expect(result).toEqual(expect.objectContaining({
                firstName: "John",
                role: "Driver"
            }));
        });

        it("creates user with provided role", async () => {
            const payload = {
                firstName: "John",
                lastName: "Doe",
                email: "test@example.com",
                password: "password",
                role: "Admin"
            };
            UserRepository.findByEmail.mockResolvedValue(null);
            BcryptUtil.hash.mockResolvedValue("hashedPassword");

            const createdUser = {
                ...payload,
                password: "hashedPassword",
                toObject: () => ({ ...payload, password: "hashedPassword" })
            };
            UserRepository.create.mockResolvedValue(createdUser);

            const result = await userService.createUser(payload);

            expect(UserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                role: "Admin"
            }));
        });
    });

    describe("getAllUsers", () => {
        it("returns all users", async () => {
            const users = [{ name: "John" }, { name: "Jane" }];
            UserRepository.findAll.mockResolvedValue(users);

            const result = await userService.getAllUsers(1, 10);
            expect(UserRepository.findAll).toHaveBeenCalledWith(1, 10);
            expect(result).toBe(users);
        });
    });

    describe("getUsersByRole", () => {
        it("returns users by role", async () => {
            const users = [{ name: "John", role: "Driver" }];
            UserRepository.findByRole.mockResolvedValue(users);

            const result = await userService.getUsersByRole("Driver", 1, 10);
            expect(UserRepository.findByRole).toHaveBeenCalledWith("Driver", 1, 10);
            expect(result).toBe(users);
        });
    });

    describe("getUserById", () => {
        it("throws 404 if user not found", async () => {
            UserRepository.findById.mockResolvedValue(null);
            await expect(userService.getUserById("1")).rejects.toMatchObject({
                message: "User not found",
                status: 404
            });
        });

        it("returns sanitized user if found", async () => {
            const user = {
                id: "1",
                firstName: "John",
                password: "hashed",
                toObject: () => ({ id: "1", firstName: "John", password: "hashed" })
            };
            UserRepository.findById.mockResolvedValue(user);

            const result = await userService.getUserById("1");
            expect(result).toEqual({ id: "1", firstName: "John" });
            expect(result.password).toBeUndefined();
        });
    });

    describe("updateUser", () => {
        it("hashes password if provided in update data", async () => {
            const updateData = { password: "newPassword" };
            BcryptUtil.hash.mockResolvedValue("newHashed");

            const updatedUser = {
                id: "1",
                password: "newHashed",
                toObject: () => ({ id: "1", password: "newHashed" })
            };
            UserRepository.update.mockResolvedValue(updatedUser);

            await userService.updateUser("1", updateData);

            expect(BcryptUtil.hash).toHaveBeenCalledWith("newPassword", 10);
            expect(UserRepository.update).toHaveBeenCalledWith("1", { password: "newHashed" });
        });

        it("throws 404 if user not found during update", async () => {
            UserRepository.update.mockResolvedValue(null);
            await expect(userService.updateUser("1", { firstName: "Jane" })).rejects.toMatchObject({
                message: "User not found",
                status: 404
            });
        });

        it("returns sanitized updated user", async () => {
            const updateData = { firstName: "Jane" };
            const updatedUser = {
                id: "1",
                firstName: "Jane",
                password: "hashed",
                toObject: () => ({ id: "1", firstName: "Jane", password: "hashed" })
            };
            UserRepository.update.mockResolvedValue(updatedUser);

            const result = await userService.updateUser("1", updateData);
            expect(result.firstName).toBe("Jane");
            expect(result.password).toBeUndefined();
        });
    });

    describe("deleteUser", () => {
        it("throws 404 if user not found", async () => {
            UserRepository.delete.mockResolvedValue(null);
            await expect(userService.deleteUser("1")).rejects.toMatchObject({
                message: "User not found",
                status: 404
            });
        });

        it("returns success message on deletion", async () => {
            UserRepository.delete.mockResolvedValue({ id: "1" });
            const result = await userService.deleteUser("1");
            expect(result).toEqual({ message: "User deleted successfully" });
        });
    });
});
