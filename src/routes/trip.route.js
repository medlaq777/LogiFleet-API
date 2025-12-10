import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import TripController from "../controllers/trip.controller.js";

class TripRoute {
  static build() {
    const router = express.Router();
    router.use(protect);

    router.post(
      "/trip",
      authorize("Admin"),
      TripController.createTrip.bind(TripController)
    );

    router.get(
      "/trips",
      authorize("Driver", TripController.getMyTrips.bind(TripController))
    );

    router.put(
      "/trip/:id",
      authorize("Driver"),
      TripController.updateTrip.bind(TripController)
    );

    router.get(
      "/trip/:id/pdf",
      authorize("Driver"),
      TripController.downloadMissionOrder.bind(TripController)
    );

    return router;
  }
}

export default TripRoute;
