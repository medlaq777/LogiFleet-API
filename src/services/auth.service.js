import userRepository from "../repositories/user.repository.js";
import JwtUtil from "../utils/jwt.util.js";
import BcryptUtil from "../utils/bycript.util.js";

class AuthService {
  constructor(userRepoInstance) {
    this.userRepository = userRepoInstance;
  }

  async register({ firstName, lastName, email, password }) {
    if (!firstName || !lastName) {
      const err = new Error("First name and last name are required.");
      err.status = 400;
      throw err;
    }

    if (!email || !password) {
      const err = new Error("Email and Password are required.");
      err.status = 400;
      throw err;
    }

    const userExist = await this.userRepository.findByEmail(email);
    if (userExist) {
      const err = new Error("User already exists");
      err.status = 409;
      throw err;
    }
    const hashed = await BcryptUtil.hash(password, 10);
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    const token = await JwtUtil.generateToken({
      id: user.id,
      fullName: user.firstName + user.lastName,
      email: user.email,
      role: user.role,
    });
    return { user: this.sanitize(user), token };
  }

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error("Email and Password are required");
      err.status = 400;
      throw err;
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const isSame = await BcryptUtil.compare(password, user.password);
    if (!isSame) {
      const err = new Error("Invalid Email or Password");
      err.status = 401;
      throw err;
    }
    const token = JwtUtil.generateToken({
      id: user.id,
      fullName: user.firstName + user.lastName,
      email: user.email,
      role: user.role,
    });
    return { user: this.sanitize(user), token };
  }

  async profile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const err = new Error("User Not Found");
      err.status = 404;
      throw err;
    }
    return this.sanitize(user);
  }

  sanitize(user) {
    if (!user || typeof user !== "object") return {};
    const obj = user?.toObject?.() ?? user;
    const { password, __v, ...rest } = obj || {};
    return rest;
  }
}
export default new AuthService(userRepository);
