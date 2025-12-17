import TrailerRoute from "../../src/routes/trailer.route.js";
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

jest.mock("../../src/controllers/trailer.controller.js", () => ({
  getAllTrailers: jest.fn(),
  createTrailer: jest.fn(),
  updateTrailer: jest.fn(),
  deleteTrailer: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest.fn().mockReturnValue("auth_Admin"),
}));

describe("TrailerRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TrailerRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /trailers", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/trailers",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define POST /trailers", () => {
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/trailers",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /trailers/:id", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/trailers/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define DELETE /trailers/:id", () => {
    expect(mockRouter.delete).toHaveBeenCalledWith(
      "/trailers/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
