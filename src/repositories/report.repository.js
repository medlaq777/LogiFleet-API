import Trip from "../models/trip.model.js";
import Alert from "../models/alert.model.js";
import Truck from "../models/trucks.model.js";
import Trailer from "../models/trailer.model.js";

class ReportRepository {
  async getTripStats() {
    return await Trip.aggregate([
      {
        $match: { status: "Terminé" },
      },
      {
        $group: {
          _id: null,
          totalDistance: {
            $sum: { $subtract: ["$endMileage", "$startMileage"] },
          },
          totalFuel: { $sum: "$fuelVolumeAdded" },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getCounts() {
    const totalTrucks = await Truck.countDocuments();
    const totalTrailers = await Trailer.countDocuments();
    const activeTrips = await Trip.countDocuments({
      status: { $in: ["À faire", "En cours"] },
    });
    const maintenanceAlerts = await Alert.countDocuments({
      type: "Maintenance",
      status: "Open",
    });

    return {
      totalTrucks,
      totalTrailers,
      activeTrips,
      maintenanceAlerts,
    };
  }

  async getMaintenanceStats() {
    const alerts = await Alert.countDocuments({
      type: "Maintenance",
      status: "Open",
    });
    return { pendingMaintenance: alerts };
  }
  async getFuelStats() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await Trip.aggregate([
      {
        $match: {
          startDate: { $gte: sixMonthsAgo },
          status: "Terminé",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$startDate" },
            year: { $year: "$startDate" },
          },
          totalFuel: { $sum: "$fuelVolumeAdded" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }

  async getMaintenanceCostStats() {
    return await Alert.aggregate([
      {
        $group: {
          _id: "$type",
          totalCost: { $sum: "$cost" },
        },
      },
    ]);
  }
}

export default new ReportRepository();
