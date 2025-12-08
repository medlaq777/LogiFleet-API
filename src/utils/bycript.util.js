import bcrypt from "bcryptjs";

class BycryptUtil {
  static async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}
export default BycryptUtil;
