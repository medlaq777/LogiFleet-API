import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import TrailerController from "../controllers/trailer.controller.js";

class TrailerRoute {
  static build() {
    const router = express.Router();
    router.use(AuthMiddleware.protect);
    router.use(AuthMiddleware.authorizeRole("Admin"));
    router.get(
      "/trailers",
      TrailerController.getAllTrailers.bind(TrailerController)
    );
    router.post(
      "/trailers",
      TrailerController.createTrailer.bind(TrailerController)
    );
    router.put(
      "/trailers/:id",
      TrailerController.updateTrailer.bind(TrailerController)
    );
    router.delete(
      "/trailers/:id",
      TrailerController.deleteTrailer.bind(TrailerController)
    );
    return router;
  }
}

export default TrailerRoute;
