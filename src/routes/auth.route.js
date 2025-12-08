import AuthController from "../controllers/auth.controller.js";

class AuthRoute {
  static build() {
    const router = express.router();
    router.post("/register", AuthController.register.bind(authController));
    router.post("/login", AuthController.login.bind(authController));

    return router;
  }
}

export default AuthRoute;
