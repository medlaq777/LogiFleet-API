import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TrailerController from "../controllers/trailer.controller.js";

class TrailerRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);

    router.get(
      "/trailers",
      AuthMiddleware.authorizeRole("Admin"),
      TrailerController.getAllTrailers.bind(TrailerController)
    );
    router.post(
      "/trailers",
      AuthMiddleware.authorizeRole("Admin"),
      TrailerController.createTrailer.bind(TrailerController)
    );
    router.put(
      "/trailers/:id",
      AuthMiddleware.authorizeRole("Admin"),
      TrailerController.updateTrailer.bind(TrailerController)
    );
    router.delete(
      "/trailers/:id",
      AuthMiddleware.authorizeRole("Admin"),
      TrailerController.deleteTrailer.bind(TrailerController)
    );
    return router;
  }
}

export default TrailerRoute;
