import authController from "../../src/controllers/auth.controller.js";
import AuthService from "../../src/services/auth.service.js";

jest.mock("../../src/services/auth.service.js", () => ({
    register: jest.fn(),
    login: jest.fn(),
    profile: jest.fn(),
    updateProfile: jest.fn(),
}));

describe("AuthController", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, user: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("calls service.register with body and returns 201", async () => {
            req.body = { email: "test" };
            AuthService.register.mockResolvedValue({ user: {}, token: "t" });

            await authController.register(req, res, next);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: {}, token: "t" });
            expect(next).not.toHaveBeenCalled();
        });

        it("calls next with error if service fails", async () => {
            const error = new Error("Fail");
            AuthService.register.mockRejectedValue(error);

            await authController.register(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("login", () => {
        it("calls service.login with body and returns 200", async () => {
            req.body = { email: "test" };
            AuthService.login.mockResolvedValue({ user: {}, token: "t" });

            await authController.login(req, res, next);

            expect(AuthService.login).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ user: {}, token: "t" });
        });

        it("calls next with error if service fails", async () => {
            const error = new Error("Fail");
            AuthService.login.mockRejectedValue(error);

            await authController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("profile", () => {
        it("calls service.profile with user id", async () => {
            req.user = { _id: "123" };
            AuthService.profile.mockResolvedValue({ id: "123" });

            await authController.profile(req, res, next);

            expect(AuthService.profile).toHaveBeenCalledWith("123");
            expect(res.json).toHaveBeenCalledWith({ id: "123" });
        });

        it("calls next with error if service fails", async () => {
            req.user = { _id: "123" };
            const error = new Error("Fail");
            AuthService.profile.mockRejectedValue(error);

            await authController.profile(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("updateProfile", () => {
        it("calls service.updateProfile with user id and body", async () => {
            req.user = { _id: "123" };
            req.body = { name: "New" };
            AuthService.updateProfile.mockResolvedValue({ id: "123", name: "New" });

            await authController.updateProfile(req, res, next);

            expect(AuthService.updateProfile).toHaveBeenCalledWith("123", req.body);
            expect(res.json).toHaveBeenCalledWith({ id: "123", name: "New" });
        });

        it("calls next with error if service fails", async () => {
            req.user = { _id: "123" };
            const error = new Error("Fail");
            AuthService.updateProfile.mockRejectedValue(error);

            await authController.updateProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
