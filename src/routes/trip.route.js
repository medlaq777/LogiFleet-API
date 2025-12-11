import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TripController from "../controllers/trip.controller.js";

class TripRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.get(
      "/trip",
      AuthMiddleware.authorizeRole("Driver"),
      TripController.getMyTrips.bind(TripController)
    );

    router.post(
      "/trip",
      AuthMiddleware.authorizeRole("Admin"),
      TripController.createTrip.bind(TripController)
    );

    router.put(
      "/trip/:id",
      AuthMiddleware.authorizeRole("Driver"),
      TripController.updateTrip.bind(TripController)
    );

    router.get(
      "/trip/:id/pdf",
      AuthMiddleware.authorizeRole("Driver"),
      TripController.downloadMissionOrder.bind(TripController)
    );

    return router;
  }
}

export default TripRoute;
