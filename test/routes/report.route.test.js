import ReportRoute from "../../src/routes/report.route.js";
import AuthMiddleware from "../../src/middlewares/auth.middleware.js";

const mockRouter = {
  get: jest.fn(),
  use: jest.fn(),
};
jest.mock("express", () => ({
  Router: jest.fn(() => mockRouter),
}));

jest.mock("../../src/controllers/report.controller.js", () => ({
  getStats: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockReturnValue("auth_Admin"),
}));

describe("ReportRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ReportRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /reports/stats with Admin role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/reports/stats",
      "auth_Admin",
      expect.any(Function)
    );
    expect(AuthMiddleware.authorizeRole).toHaveBeenCalledWith("Admin");
  });
});
