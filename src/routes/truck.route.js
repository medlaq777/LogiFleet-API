import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TruckController from "../controllers/truck.controller.js";

class TruckRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.use(AuthMiddleware.authorizeRole("Admin"));
    router.get("/trucks", TruckController.getAllTrucks.bind(TruckController));
    router.post("/trucks", TruckController.createTruck.bind(TruckController));
    router.put(
      "/trucks/:id",
      TruckController.updateTruck.bind(TruckController)
    );
    router.delete(
      "/trucks/:id",
      TruckController.deleteTruck.bind(TruckController)
    );
    return router;
  }
}

export default TruckRoute;
