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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { items, total } = await this.service.getAllTrailers(page, limit);
      res
        .status(200)
        .json({ success: true, count: total, data: items });
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
