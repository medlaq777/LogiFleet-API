import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import ReportController from "../controllers/report.controller.js";

class ReportRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.use(AuthMiddleware.authorizeRole("Admin"));

    router.get(
      "/reports/stats",
      ReportController.getStats.bind(ReportController)
    );

    return router;
  }
}

export default ReportRoute;
