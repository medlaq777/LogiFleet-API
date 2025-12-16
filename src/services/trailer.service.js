import TrailerRepository from "../repositories/trailer.repository.js";
class TrailerService {
  constructor(trailerRepository) {
    this.trailerRepository = trailerRepository;
  }

  async getAllTrailers(page, limit) {
    return this.trailerRepository.findAll(page, limit);
  }

  async createTrailer(data) {
    if (!data.licensePlate || !data.make || !data.model || !data.capacity) {
      const err = new Error(
        "License Plate, make, model and capacity are required"
      );
      err.status = 400;
      throw err;
    }
    return this.trailerRepository.create(data);
  }

  async updateTrailer(id, data) {
    const trailer = await this.trailerRepository.findById(id);
    if (!trailer) {
      const err = new Error("Trailer Not Found");
      err.status = 404;
      throw err;
    }
    return this.trailerRepository.update(id, data);
  }

  async deleteTrailer(id) {
    const trailer = await this.trailerRepository.findById(id);
    if (!trailer) {
      const err = new Error("Trailer Not Found");
      err.status = 404;
      throw err;
    }
    return this.trailerRepository.delete(id);
  }
}

export default new TrailerService(TrailerRepository);
