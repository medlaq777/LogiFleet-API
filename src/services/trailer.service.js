import TrailerRepository from "../repositories/trailer.repository.js";
class TrailerService {
  constructor(trailerRepository) {
    this.trailerRepository = trailerRepository;
  }

  async getAlltrailers() {
    return this.trailerRepository.findAll();
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

    if (data.capacity && trailer.status === "Attachée") {
      const err = new Error("Cannot modify attached trailer");
      err.status = 400;
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

    if (trailer.status === "Attachée") {
      const err = new Error("Cannot remove attached trailer");
      err.status = 400;
      throw err;
    }
    return this.trailerRepository.delete(id);
  }
}

export default new TrailerService(TrailerRepository);
