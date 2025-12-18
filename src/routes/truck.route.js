import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TruckController from "../controllers/truck.controller.js";

class TruckRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);

    router.get("/trucks", AuthMiddleware.authorizeRole("Admin"), TruckController.getAllTrucks.bind(TruckController));
    router.post("/trucks", AuthMiddleware.authorizeRole("Admin"), TruckController.createTruck.bind(TruckController));
    router.put(
      "/trucks/:id",
      AuthMiddleware.authorizeRole("Admin"),
      TruckController.updateTruck.bind(TruckController)
    );
    router.delete(
      "/trucks/:id",
      AuthMiddleware.authorizeRole("Admin"),
      TruckController.deleteTruck.bind(TruckController)
    );
    return router;
  }
}

export default TruckRoute;
