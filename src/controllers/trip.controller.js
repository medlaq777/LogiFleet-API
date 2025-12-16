import TripService from "../services/trip.service.js";

class TripController {
  constructor(service) {
    this.service = service;
  }

  async getAllTrips(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit);
      const trips = await this.service.getAllTrips(page, limit);
      res.status(200).json({ succes: true, count: trips.length, data: trips });
    } catch (err) {
      next(err);
    }
  }

  async createTrip(req, res, next) {
    try {
      const adminId = req.user._id;
      const trip = await this.service.createTrip(req.body, adminId);
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
      const isAdmin = req.user.role === 'Admin';
      let updatedTrip;

      if (isAdmin) {
        // Admin can update any trip
        updatedTrip = await this.service.updateTrip(req.params.id, req.body);
      } else {
        // Driver can only update their own trip status
        updatedTrip = await this.service.updateTripStatus(
          req.params.id,
          req.user._id,
          req.body
        );
      }

      res.status(200).json({ success: true, data: updatedTrip });
    } catch (err) {
      next(err);
    }
  }

  async deleteTrip(req, res, next) {
    try {
      await this.service.deleteTrip(req.params.id);
      res.status(200).json({ success: true, message: 'Trip deleted successfully' });
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
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=mission-${req.params.id}.pdf`
      );
      doc.pipe(res);
      doc.end();
    } catch (err) {
      next(err);
    }
  }
}

export default new TripController(TripService);
