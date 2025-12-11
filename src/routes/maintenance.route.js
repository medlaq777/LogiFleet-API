import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import MaintenanceController from "../controllers/maintenance.controller.js";

class MaintenanceRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.use(AuthMiddleware.authorizeRole("Admin"));

    router.get(
      "/maintenance/rules",
      MaintenanceController.getRules.bind(MaintenanceController)
    );
    router.put(
      "/maintenance/rules",
      MaintenanceController.updateRule.bind(MaintenanceController)
    );

    return router;
  }
}

export default MaintenanceRoute;
