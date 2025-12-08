import express from "express";
import AuthController from "../controllers/auth.controller.js";

class AuthRoute {
  static build() {
    const router = express.Router();
    router.post("/register", AuthController.register.bind(AuthController));
    router.post("/login", AuthController.login.bind(AuthController));

    return router;
  }
}

export default AuthRoute;
