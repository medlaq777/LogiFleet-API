import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UserController from "../controllers/user.controller.js";

class UserRoute {
    static build() {
        const router = express.Router();
        router.use(AuthMiddleware.protect);
        // Remove global admin check to prevent blocking other routers

        router.get("/users", AuthMiddleware.authorizeRole("Admin"), UserController.getAllUsers.bind(UserController));
        router.post("/users", AuthMiddleware.authorizeRole("Admin"), UserController.createUser.bind(UserController));
        router.get("/users/:id", AuthMiddleware.authorizeRole("Admin"), UserController.getUserById.bind(UserController));
        router.put("/users/:id", AuthMiddleware.authorizeRole("Admin"), UserController.updateUser.bind(UserController));
        router.delete("/users/:id", AuthMiddleware.authorizeRole("Admin"), UserController.deleteUser.bind(UserController));

        return router;
    }
}

export default UserRoute;
