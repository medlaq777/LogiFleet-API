import JwtUtil from "../utils/jwt.util.js";
class AuthMiddleware {
  static protect(req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) {
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

  static authorizeRole(...roles) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          const err = new Error("Unauthorized");
          err.status = 401;
          throw err;
        }
        const userRole = req.user.role?.toLowerCase() || "";
        const allowedRoles = roles.map(r => r.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
          const err = new Error("Forbidden");
          err.status = 403;
          throw err;
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}
export default AuthMiddleware;
