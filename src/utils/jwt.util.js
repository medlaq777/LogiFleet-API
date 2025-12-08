import Jwt from "jsonwebtoken.js";
import Config from "../config/config.js";

class JwtUtil {
  static generateToken(payload) {
    return Jwt.sign(payload, Config.JWTSECRET, {
      expiresIn: Config.JWTEXPIRESIN,
    });
  }
  static verifyToken(token) {
    return Jwt.verifyToken(token, Config.JWTSECRET);
  }
}
export default JwtUtil;
