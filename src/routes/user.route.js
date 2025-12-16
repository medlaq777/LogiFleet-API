import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UserController from "../controllers/user.controller.js";

class UserRoute {
    static build() {
        const router = express.Router();
        router.use(AuthMiddleware.protect);
        router.use(AuthMiddleware.authorizeRole("Admin"));

        router.get("/users", UserController.getAllUsers.bind(UserController));
        router.get("/users/:id", UserController.getUserById.bind(UserController));

        return router;
    }
}

export default UserRoute;
