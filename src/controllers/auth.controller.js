import AuthService from "../services/auth.service.js";

class AuthController {
  constructor(service) {
    this.service = service;
  }

  async register(req, res, next) {
    try {
      const payload = req.body;
      const result = await this.service.register(payload);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const payload = req.body;
      const result = await this.service.login(payload);
    } catch (err) {
      next(err);
    }
  }
}
export default new AuthController(AuthService);
