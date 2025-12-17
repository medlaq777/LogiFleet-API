import TrailerRepository from "../../src/repositories/trailer.repository.js";
import Trailer from "../../src/models/trailer.model.js";

jest.mock("../../src/models/trailer.model.js", () => ({
    find: jest.fn(),
}));

describe("TrailerRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAvailable", () => {
        it("finds available trailers", async () => {
            const trailers = [{ status: "Disponible" }];
            Trailer.find.mockResolvedValue(trailers);

            const result = await TrailerRepository.findAvailable();

            expect(Trailer.find).toHaveBeenCalledWith({ status: "Disponible" });
            expect(result).toBe(trailers);
        });
    });
});
