import trailerService from "../../src/services/trailer.service.js";
import TrailerRepository from "../../src/repositories/trailer.repository.js";

jest.mock("../../src/repositories/trailer.repository.js", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("TrailerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTrailers", () => {
    it("returns all trailers", async () => {
      const trailers = [{ id: "1" }, { id: "2" }];
      TrailerRepository.findAll.mockResolvedValue(trailers);

      const result = await trailerService.getAllTrailers();

      expect(TrailerRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(trailers);
    });
  });

  describe("createTrailer", () => {
    it("throws 400 when required fields are missing", async () => {
      const payload = {
        licensePlate: "",
        make: "",
        model: "",
        capacity: null,
      };

      await expect(trailerService.createTrailer(payload)).rejects.toMatchObject(
        {
          message: "License Plate, make, model and capacity are required",
          status: 400,
        }
      );
    });

    it("creates trailer when data is valid", async () => {
      const payload = {
        licensePlate: "TRL123",
        make: "Schmitz",
        model: "S.KO",
        capacity: 25000,
      };
      const created = { id: "1", ...payload };

      TrailerRepository.create.mockResolvedValue(created);

      const result = await trailerService.createTrailer(payload);

      expect(TrailerRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toBe(created);
    });
  });

  describe("updateTrailer", () => {
    it("throws 404 when trailer not found", async () => {
      TrailerRepository.findById.mockResolvedValue(null);

      await expect(
        trailerService.updateTrailer("1", { capacity: 30000 })
      ).rejects.toMatchObject({
        message: "Trailer Not Found",
        status: 404,
      });

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.update).not.toHaveBeenCalled();
    });

    it("throws 400 when modifying capacity of attached trailer", async () => {
      const existing = {
        id: "1",
        status: "Attachée",
      };
      TrailerRepository.findById.mockResolvedValue(existing);

      await expect(
        trailerService.updateTrailer("1", { capacity: 30000 })
      ).rejects.toMatchObject({
        message: "Cannot modify attached trailer",
        status: 400,
      });

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.update).not.toHaveBeenCalled();
    });

    it("updates trailer when valid and not attached or capacity not changed", async () => {
      const existing = {
        id: "1",
        status: "Détachée",
      };
      const updateData = { capacity: 30000 };
      const updated = { ...existing, ...updateData };

      TrailerRepository.findById.mockResolvedValue(existing);
      TrailerRepository.update.mockResolvedValue(updated);

      const result = await trailerService.updateTrailer("1", updateData);

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.update).toHaveBeenCalledWith("1", updateData);
      expect(result).toBe(updated);
    });
  });

  describe("deleteTrailer", () => {
    it("throws 404 when trailer not found", async () => {
      TrailerRepository.findById.mockResolvedValue(null);

      await expect(trailerService.deleteTrailer("1")).rejects.toMatchObject({
        message: "Trailer Not Found",
        status: 404,
      });

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.delete).not.toHaveBeenCalled();
    });

    it("throws 400 when trailer is attached", async () => {
      const existing = {
        id: "1",
        status: "Attachée",
      };
      TrailerRepository.findById.mockResolvedValue(existing);

      await expect(trailerService.deleteTrailer("1")).rejects.toMatchObject({
        message: "Cannot remove attached trailer",
        status: 400,
      });

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.delete).not.toHaveBeenCalled();
    });

    it("deletes trailer when not attached", async () => {
      const existing = {
        id: "1",
        status: "Détachée",
      };
      TrailerRepository.findById.mockResolvedValue(existing);
      TrailerRepository.delete.mockResolvedValue(true);

      const result = await trailerService.deleteTrailer("1");

      expect(TrailerRepository.findById).toHaveBeenCalledWith("1");
      expect(TrailerRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });
});
