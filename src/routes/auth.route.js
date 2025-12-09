import express from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

class AuthRoute {
  static build() {
    const router = express.Router();
    router.post("/register", AuthController.register.bind(AuthController));
    router.post("/login", AuthController.login.bind(AuthController));
    router.get(
      "/profile",
      AuthMiddleware.protect,
      AuthController.profile.bind(AuthController)
    );
    return router;
  }
}

export default AuthRoute;
