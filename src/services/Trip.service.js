import TripRepository from "../repositories/trip.repository.js";
import TruckService from "./truck.service.js";
import TireService from "./tire.service.js";
import PdfGenerator from "../utils/pdf.util.js";
import MaintenanceRepository from "../repositories/maintenance.repository.js";
import AlertRepository from "../repositories/alert.repository.js";

class TripService {
  constructor(
    tripRepository,
    truckService,
    tireService,
    pdfGenerator,
    maintenanceRepository,
    alertRepository
  ) {
    this.tripRepository = tripRepository;
    this.truckService = truckService;
    this.tireService = tireService;
    this.pdfGenerator = pdfGenerator;
    this.maintenanceRepository = maintenanceRepository;
    this.alertRepository = alertRepository;
  }

  async getAllTrips(page, limit) {
    return this.tripRepository.findAll(page, limit);
  }

  async createTrip(data, adminId) {
    if (!data.truckId) {
      const err = new Error("Truck ID is required");
      err.status = 400;
      throw err;
    }

    const truck = await this.truckService.findById(data.truckId);
    if (!truck) {
      const err = new Error("Truck not found");
      err.status = 404;
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

  async updateTrip(id, updateData) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      const err = new Error("Trip not found");
      err.status = 404;
      throw err;
    }
    return this.tripRepository.update(id, updateData);
  }

  async deleteTrip(id) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      const err = new Error("Trip not found");
      err.status = 404;
      throw err;
    }
    return this.tripRepository.delete(id);
  }

  async updateTripStatus(id, driverId, updateData) {
    const trip = await this.tripRepository.findByIdPopulated(id);
    if (!trip) {
      const err = new Error("Trip Not found");
      err.status = 404;
      throw err;
    }
    if (trip.driverId._id.toString() !== driverId.toString()) {
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
    const distance = data.endMileage - trip.truckId.currentMileage;
    if (distance < 0) {
      const err = new Error("Mileage inconsistency");
      err.status = 400;
      throw err;
    }
    await this.truckService.updateTruck(trip.truckId._id, {
      currentMileage: data.endMileage,
    });

    if (this.maintenanceRepository && this.alertRepository) {
      const rules = await this.maintenanceRepository.findAll();

      for (const rule of rules) {
        const maintenanceInterval = rule.intervalKm;
        const previousMileage = data.endMileage - distance;

        if (
          Math.floor(previousMileage / maintenanceInterval) <
          Math.floor(data.endMileage / maintenanceInterval)
        ) {
          await this.alertRepository.create({
            truckId: trip.truckId._id,
            type: "Maintenance",
            message: `Maintenance ${rule.type} required (Interval: ${maintenanceInterval}km).`,
          });
        }
      }
    }
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

    return this.pdfGenerator.generateMissionOrder(trip);
  }
}

export default new TripService(
  TripRepository,
  TruckService,
  TireService,
  PdfGenerator,
  MaintenanceRepository,
  AlertRepository
);
