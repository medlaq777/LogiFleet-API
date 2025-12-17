import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import ReportController from "../controllers/report.controller.js";

class ReportRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);

    router.get(
      "/reports/stats",
      AuthMiddleware.authorizeRole("Admin"),
      ReportController.getStats.bind(ReportController)
    );

    return router;
  }
}

export default ReportRoute;
