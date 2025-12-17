import TireRoute from "../../src/routes/tire.route.js";
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

jest.mock("../../src/controllers/tire.controller.js", () => ({
  getAllTire: jest.fn(),
  createTire: jest.fn(),
  updateTire: jest.fn(),
  checkMaintenance: jest.fn(),
  deleteTire: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockReturnValue("auth_Admin"),
}));

describe("TireRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TireRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /tires", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/tires",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define POST /tires", () => {
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/tires",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /tires/:id", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/tires/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define GET /tires/:id/maintenance", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/tires/:id/maintenance",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define DELETE /tires/:id", () => {
    expect(mockRouter.delete).toHaveBeenCalledWith(
      "/tires/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
