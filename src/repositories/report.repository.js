import Trip from "../models/trip.model.js";
import Alert from "../models/alert.model.js";

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

  async getMaintenanceStats() {
    const alerts = await Alert.countDocuments({
      type: "Maintenance",
      status: "Open",
    });
    return { pendingMaintenance: alerts };
  }
}

export default new ReportRepository();
