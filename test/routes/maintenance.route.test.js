import MaintenanceRoute from "../../src/routes/maintenance.route.js";
import AuthMiddleware from "../../src/middlewares/auth.middleware.js";

const mockRouter = {
  get: jest.fn(),
  put: jest.fn(),
  use: jest.fn(),
};
jest.mock("express", () => ({
  Router: jest.fn(() => mockRouter),
}));

jest.mock("../../src/controllers/maintenance.controller.js", () => ({
  getRules: jest.fn(),
  getAlerts: jest.fn(),
  updateAlert: jest.fn(),
  updateRule: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockReturnValue("auth_Admin"),
}));

describe("MaintenanceRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MaintenanceRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /maintenance/rules", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/maintenance/rules",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define GET /maintenance/alerts", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/maintenance/alerts",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /maintenance/alerts/:id", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/maintenance/alerts/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /maintenance/rules/:id", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/maintenance/rules/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
