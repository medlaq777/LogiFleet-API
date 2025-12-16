import UserService from "../services/user.service.js";

class UserController {
    constructor(service) {
        this.service = service;
    }

    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const role = req.query.role;

            let result;
            if (role) {
                result = await this.service.getUsersByRole(role, page, limit);
            } else {
                result = await this.service.getAllUsers(page, limit);
            }

            res.status(200).json({ success: true, count: result.total, data: result.items });
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await this.service.getUserById(req.params.id);
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController(UserService);
