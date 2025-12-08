import JwtUtil from "../utils/jwt.util.js";
class AuthMiddleware {
  static protect(req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header?.startswith("Bearer ")) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
      }
      const token = header.split(" ")[1];
      const payload = JwtUtil.verifyToken(token);
      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  }

  
}
export default AuthMiddleware;
