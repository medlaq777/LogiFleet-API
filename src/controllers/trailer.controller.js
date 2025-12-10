import TrailerService from "../services/trailer.service.js";

class TrailerController {
  constructor(service) {
    this.service = service;
  }

  async createTrailer(req, res, next) {
    try {
      const newTrailer = await this.service.createTrailer(req.body);
      res.status(201).json({ success: true, data: newTrailer });
    } catch (err) {
      next(err);
    }
  }

  async getAllTrailers(req, res, next) {
    try {
      const trailers = this.service.getAllTrailers();
      res
        .status(200)
        .json({ success: true, count: trailers.length, data: trailers });
    } catch (err) {
      next(err);
    }
  }

  async updateTrailer(req, res, next) {
    try {
      const trailer = await this.service.updateTrailer(req.params.id, req.body);
      res.status(200).json({ success: true, data: trailer });
    } catch (err) {
      next(err);
    }
  }

  async deleteTrailer(req, res, next) {
    try {
      await this.service.deleteTrailer(req.params.id);
      res.status(200).json({ success: true, message: "Trailer Was deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default new TrailerController(TrailerService);
