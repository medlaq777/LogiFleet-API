import TripRepository from "../repositories/trip.repository.js";
import TruckService from "./truck.service.js";
import PdfGenerator from "../utils/pdf.util.js";

class TripService {
  constructor(tripRepository, truckService, pdfGenerator) {
    this.tripRepository = tripRepository;
    this.truckService = truckService;
    this.pdfGenerator = pdfGenerator;
  }

  async createTrip(data, adminId) {
    const truck = await this.truckService.findById(data.truckId);
    if (!truck) {
      const err = new Error("Truck ID required");
      err.status = 400;
      throw err;
    }
    if (truck.status !== "Disponible") {
      const err = new Error("Truck not available");
      err.status = 400;
      throw err;
    }

    const tripData = { ...data, adminId };
    return await this.tripRepository.create(tripData);
  }

  async getDriverTrips(driverId) {
    return this.tripRepository.findByDriverId(driverId);
  }

  async updateTripStatus(id, driverId, updateData) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      const err = new Error("Trip Not found");
      err.status = 404;
      throw err;
    }
    if (trip.driverId.toString() !== driverId.toString()) {
      const err = new Error("Cannot access this Trip");
      err.status = 403;
      throw err;
    }

    if (updateData.status === "Terminé" && trip.status !== "Terminé") {
      await this._finalizeTrip(trip, updateData);
    }
    return this.tripRepository.update(id, updateData);
  }

  async _finalizeTrip(trip, data) {
    if (!data.endMileage) {
      const err = new Error("Required End Mileage for complete the trip ");
      err.status = 400;
      throw err;
    }

    const distance =
      data.endMileage - (data.startMileage || trip.truckId.currentMileage);
    if (distance < 0) {
      const err = new Error("Mileage inconsistency");
      err.status = 400;
      throw err;
    }
    await this.truckService.updateTruck(trip.truckId, {
      currentMileage: data.endMileage,
    });
  }

  async generateMissionOrderPdf(id, driverId) {
    const trip = await this.tripRepository.findByIdPopulated(id);
    if (!trip) {
      const err = new Error("Trip Not Found");
      err.status = 404;
      throw err;
    }

    if (driverId && trip.driverId._id.toString() !== driverId.toString()) {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }

    return this.pdfGenerator.generatMissionOrderPdf(trip);
  }
}

export default new TripService(TripRepository, TruckService, PdfGenerator);
