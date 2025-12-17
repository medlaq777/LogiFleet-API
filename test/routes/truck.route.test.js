import TruckRoute from "../../src/routes/truck.route.js";
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

jest.mock("../../src/controllers/truck.controller.js", () => ({
  getAllTrucks: jest.fn(),
  createTruck: jest.fn(),
  updateTruck: jest.fn(),
  deleteTruck: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockReturnValue("auth_Admin"),
}));

describe("TruckRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TruckRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /trucks", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/trucks",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define POST /trucks", () => {
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/trucks",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /trucks/:id", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/trucks/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define DELETE /trucks/:id", () => {
    expect(mockRouter.delete).toHaveBeenCalledWith(
      "/trucks/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
