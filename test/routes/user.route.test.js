import UserRoute from "../../src/routes/user.route.js";
import AuthMiddleware from "../../src/middlewares/auth.middleware.js";

const mockRouter = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  use: jest.fn(),
};
jest.mock("express", () => ({
  Router: jest.fn(() => mockRouter),
}));

jest.mock("../../src/controllers/user.controller.js", () => ({
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockImplementation((role) => `auth_${role}`),
}));

describe("UserRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserRoute.build();
  });

  it("should apply global protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /users with Admin role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/users",
      "auth_Admin",
      expect.any(Function)
    );
    expect(AuthMiddleware.authorizeRole).toHaveBeenCalledWith("Admin");
  });

  it("should define POST /users with Admin role", () => {
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/users",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define GET /users/:id with Admin role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/users/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /users/:id with Admin role", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/users/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define DELETE /users/:id with Admin role", () => {
    expect(mockRouter.delete).toHaveBeenCalledWith(
      "/users/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
