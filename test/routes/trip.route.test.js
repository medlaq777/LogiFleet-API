import TripRoute from "../../src/routes/trip.route.js";
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

jest.mock("../../src/controllers/trip.controller.js", () => ({
  getMyTrips: jest.fn(),
  downloadMissionOrder: jest.fn(),
  getAllTrips: jest.fn(),
  createTrip: jest.fn(),
  updateTrip: jest.fn(),
  deleteTrip: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware.js", () => ({
  protect: jest.fn(),
  authorizeRole: jest
    .fn()
    .mockImplementation((...roles) => `auth_${roles.join("_")}`),
}));

describe("TripRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TripRoute.build();
  });

  it("should apply protect middleware", () => {
    expect(mockRouter.use).toHaveBeenCalledWith(AuthMiddleware.protect);
  });

  it("should define GET /trip with Driver role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/trip",
      "auth_Driver",
      expect.any(Function)
    );
  });

  it("should define GET /trip/:id/pdf with Driver role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/trip/:id/pdf",
      "auth_Driver",
      expect.any(Function)
    );
  });

  it("should define GET /trips with Admin role", () => {
    expect(mockRouter.get).toHaveBeenCalledWith(
      "/trips",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define POST /trip with Admin role", () => {
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/trip",
      "auth_Admin",
      expect.any(Function)
    );
  });

  it("should define PUT /trip/:id with Admin, Driver roles", () => {
    expect(mockRouter.put).toHaveBeenCalledWith(
      "/trip/:id",
      "auth_Admin_Driver",
      expect.any(Function)
    );
  });

  it("should define DELETE /trip/:id with Admin role", () => {
    expect(mockRouter.delete).toHaveBeenCalledWith(
      "/trip/:id",
      "auth_Admin",
      expect.any(Function)
    );
  });
});
