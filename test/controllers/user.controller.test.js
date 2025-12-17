import userController from "../../src/controllers/user.controller.js";
import UserService from "../../src/services/user.service.js";

jest.mock("../../src/services/user.service.js", () => ({
    getUsersByRole: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
}));

describe("UserController", () => {
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

    describe("getAllUsers", () => {
        it("calls getAllUsers when no role provided", async () => {
            req.query = { page: "2", limit: "20" };
            UserService.getAllUsers.mockResolvedValue({ total: 10, items: [] });

            await userController.getAllUsers(req, res, next);

            expect(UserService.getAllUsers).toHaveBeenCalledWith(2, 20);
            expect(UserService.getUsersByRole).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 10, data: [] });
        });

        it("calls getUsersByRole when role provided", async () => {
            req.query = { role: "driver", page: "1" };
            UserService.getUsersByRole.mockResolvedValue({ total: 5, items: [] });

            await userController.getAllUsers(req, res, next);

            expect(UserService.getUsersByRole).toHaveBeenCalledWith("driver", 1, 100);
            expect(UserService.getAllUsers).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ success: true, count: 5, data: [] });
        });

        it("calls next with error", async () => {
            UserService.getAllUsers.mockRejectedValue(new Error("Fail"));
            await userController.getAllUsers(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("getUserById", () => {
        it("calls getUserById and returns user", async () => {
            req.params.id = "1";
            UserService.getUserById.mockResolvedValue({ id: "1" });

            await userController.getUserById(req, res, next);

            expect(UserService.getUserById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1" } });
        });
        it("calls next with error", async () => {
            UserService.getUserById.mockRejectedValue(new Error("Fail"));
            await userController.getUserById(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("createUser", () => {
        it("calls createUser and returns created user", async () => {
            req.body = { name: "test" };
            UserService.createUser.mockResolvedValue({ id: "1", name: "test" });

            await userController.createUser(req, res, next);

            expect(UserService.createUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1", name: "test" } });
        });
        it("calls next with error", async () => {
            UserService.createUser.mockRejectedValue(new Error("Fail"));
            await userController.createUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateUser", () => {
        it("calls updateUser and returns updated user", async () => {
            req.params.id = "1";
            req.body = { name: "new" };
            UserService.updateUser.mockResolvedValue({ id: "1", name: "new" });

            await userController.updateUser(req, res, next);

            expect(UserService.updateUser).toHaveBeenCalledWith("1", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "1", name: "new" } });
        });
        it("calls next with error", async () => {
            UserService.updateUser.mockRejectedValue(new Error("Fail"));
            await userController.updateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteUser", () => {
        it("calls deleteUser and returns success", async () => {
            req.params.id = "1";
            UserService.deleteUser.mockResolvedValue({ message: "Deleted" });

            await userController.deleteUser(req, res, next);

            expect(UserService.deleteUser).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Deleted" });
        });
        it("calls next with error", async () => {
            UserService.deleteUser.mockRejectedValue(new Error("Fail"));
            await userController.deleteUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
