import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import MaintenanceController from "../controllers/maintenance.controller.js";

class MaintenanceRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);

    router.get(
      "/maintenance/rules",
      AuthMiddleware.authorizeRole("Admin"),
      MaintenanceController.getRules.bind(MaintenanceController)
    );
    router.get(
      "/maintenance/alerts",
      AuthMiddleware.authorizeRole("Admin"),
      MaintenanceController.getAlerts.bind(MaintenanceController)
    );
    router.put(
      "/maintenance/alerts/:id",
      AuthMiddleware.authorizeRole("Admin"),
      MaintenanceController.updateAlert.bind(MaintenanceController)
    );
    router.put(
      "/maintenance/rules/:id",
      AuthMiddleware.authorizeRole("Admin"),
      MaintenanceController.updateRule.bind(MaintenanceController)
    );

    return router;
  }
}

export default MaintenanceRoute;
