import AuthRoute from "../../src/routes/auth.route.js";
import AuthMiddleware from "../../src/middlewares/auth.middleware.js";


const mockRouter = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
};
jest.mock("express", () => ({
    Router: jest.fn(() => mockRouter),
}));


jest.mock("../../src/controllers/auth.controller.js", () => ({
    register: jest.fn(),
    login: jest.fn(),
    profile: jest.fn(),
    updateProfile: jest.fn(),
}));


jest.mock("../../src/middlewares/auth.middleware.js", () => ({
    protect: jest.fn(),
}));

describe("AuthRoute", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AuthRoute.build();
    });

    it("should define POST /register", () => {
        expect(mockRouter.post).toHaveBeenCalledWith(
            "/register",
            expect.any(Function)
        );
    });

    it("should define POST /login", () => {
        expect(mockRouter.post).toHaveBeenCalledWith(
            "/login",
            expect.any(Function)
        );
    });

    it("should define GET /profile with protect middleware", () => {
        expect(mockRouter.get).toHaveBeenCalledWith(
            "/profile",
            AuthMiddleware.protect,
            expect.any(Function)
        );
    });

    it("should define PUT /profile with protect middleware", () => {
        expect(mockRouter.put).toHaveBeenCalledWith(
            "/profile",
            AuthMiddleware.protect,
            expect.any(Function)
        );
    });
});
