import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TireController from "../controllers/tire.controller.js";

class TireRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);

    router.get("/tires", AuthMiddleware.authorizeRole("Admin"), TireController.getAllTire.bind(TireController));
    router.post("/tires", AuthMiddleware.authorizeRole("Admin"), TireController.createTire.bind(TireController));
    router.put("/tires/:id", AuthMiddleware.authorizeRole("Admin"), TireController.updateTire.bind(TireController));
    router.get(
      "/tires/:id/maintenance",
      AuthMiddleware.authorizeRole("Admin"),
      TireController.checkMaintenance.bind(TireController)
    );
    router.delete("/tires/:id", AuthMiddleware.authorizeRole("Admin"), TireController.deleteTire.bind(TireController));
    return router;
  }
}

export default TireRoute;
