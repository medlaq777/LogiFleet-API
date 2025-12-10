import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TireController from "../controllers/tire.controller.js";

class TireRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.use(AuthMiddleware.authorizeRole("Admin"));
    router.get("/tires", TireController.getAllTire.bind(TireController));
    router.post("/tires", TireController.createTire.bind(TireController));
    router.put("/tires/:id", TireController.updateTire.bind(TireController));
    router.delete("/tires/:id", TireController.deleteTire.bind(TireController));
    return router;
  }
}

export default TireRoute;
