import TripService from "../services/trip.service.js";

class TripController {
  constructor(service) {
    this.service = service;
  }

  async createTrip(req, res, next) {
    try {
      const trip = await this.service.createTrip(req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async getMyTrips(req, res, next) {
    try {
      const trips = await this.service.getDriverTrips(req.user._id);
      res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
      next(err);
    }
  }

  async updateTrip(req, res, next) {
    try {
      const updatedTrip = await this.service.updateTripStatus(
        req.params.id,
        req.user._id,
        req.body
      );
      res.status(200).json({ success: true, data: updatedTrip });
    } catch (err) {
      next(err);
    }
  }

  async downloadMissionOrder(req, res, next) {
    try {
      const doc = await this.service.generateMissionOrderPdf(
        req.params.id,
        req.user._id
      );
      res.serHeader("Content-Type", "application/pdf");
      res.serHeader(
        "Content-Disposition",
        `attachement; filename=mission-${req.params.id}.pdf`
      );
      doc.pipe(res);
      doc.end();
    } catch (err) {
      next(err);
    }
  }
}

export default new TripController(TripService);
