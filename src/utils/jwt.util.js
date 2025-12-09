import Jwt from "jsonwebtoken";
import Config from "../config/config.js";

class JwtUtil {
  static generateToken(payload) {
    return Jwt.sign(payload, Config.JWTSECRET, {
      expiresIn: Config.JWTEXPIRESIN,
    });
  }
  static verifyToken(token) {
    return Jwt.verify(token, Config.JWTSECRET);
  }
}
export default JwtUtil;
