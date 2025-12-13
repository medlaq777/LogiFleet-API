import authService from "../../src/services/auth.service.js";
import userRepository from "../../src/repositories/user.repository.js";
import JwtUtil from "../../src/utils/jwt.util.js";
import BcryptUtil from "../../src/utils/bycript.util.js";

jest.mock("../../src/repositories/user.repository", () => ({
  __esModule: true,
  default: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("../../src/utils/jwt.util.js", () => ({
  __esModule: true,
  default: {
    generateToken: jest.fn(),
  },
}));

jest.mock("../../src/utils/bycript.util.js", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("throws 400 when firstName or lastName is missing", async () => {
      const payload = {
        firstName: "",
        lastName: "",
        email: "test@example.com",
        password: "password123",
      };

      await expect(authService.register(payload)).rejects.toMatchObject({
        message: "First name and last name are required.",
        status: 400,
      });
    });

    it("throws 400 when email or password is missing", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
      };

      await expect(authService.register(payload)).rejects.toMatchObject({
        message: "Email and Password are required.",
        status: 400,
      });
    });

    it("throws 409 when user already exists", async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: "existing-id",
        email: "test@example.com",
      });

      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password123",
      };

      await expect(authService.register(payload)).rejects.toMatchObject({
        message: "User already exists",
        status: 409,
      });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });

    it("creates user, hashes password, generates token and returns sanitized user", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password123",
      };

      userRepository.findByEmail.mockResolvedValue(null);
      BcryptUtil.hash.mockResolvedValue("hashedPwd");
      const createdUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "hashedPwd",
        role: "user",
        __v: 0,
      };
      userRepository.create.mockResolvedValue(createdUser);
      JwtUtil.generateToken.mockReturnValue("token123");

      const result = await authService.register(payload);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(BcryptUtil.hash).toHaveBeenCalledWith("password123", 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "hashedPwd",
      });
      expect(JwtUtil.generateToken).toHaveBeenCalledWith({
        _id: "123",
        fullName: "JohnDoe",
        email: "test@example.com",
        role: "user",
      });

      expect(result.token).toBe("token123");
      expect(result.user).toEqual(
        expect.objectContaining({
          id: "123",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          role: "user",
        })
      );
      expect(result.user.password).toBeUndefined();
      expect(result.user.__v).toBeUndefined();
    });
  });

  describe("login", () => {
    it("throws 400 when email or password is missing", async () => {
      const payload = {
        email: "",
        password: "",
      };

      await expect(authService.login(payload)).rejects.toMatchObject({
        message: "Email and Password are required",
        status: 400,
      });
    });

    it("throws 401 when user is not found", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const payload = {
        email: "notfound@example.com",
        password: "password123",
      };

      await expect(authService.login(payload)).rejects.toMatchObject({
        message: "Invalid email or password",
        status: 401,
      });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "notfound@example.com"
      );
    });

    it("throws 401 when password is incorrect", async () => {
      const user = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "hashedPwd",
        role: "user",
      };
      userRepository.findByEmail.mockResolvedValue(user);
      BcryptUtil.compare.mockResolvedValue(false);

      const payload = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      await expect(authService.login(payload)).rejects.toMatchObject({
        message: "Invalid Email or Password",
        status: 401,
      });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(BcryptUtil.compare).toHaveBeenCalledWith(
        "wrongPassword",
        "hashedPwd"
      );
    });

    it("returns token and sanitized user when credentials are valid", async () => {
      const user = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "hashedPwd",
        role: "user",
        __v: 0,
      };
      userRepository.findByEmail.mockResolvedValue(user);
      BcryptUtil.compare.mockResolvedValue(true);
      JwtUtil.generateToken.mockReturnValue("tokenLogin");

      const payload = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await authService.login(payload);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(BcryptUtil.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPwd"
      );
      expect(JwtUtil.generateToken).toHaveBeenCalledWith({
        _id: "123",
        fullName: "JohnDoe",
        email: "test@example.com",
        role: "user",
      });

      expect(result.token).toBe("tokenLogin");
      expect(result.user).toEqual(
        expect.objectContaining({
          id: "123",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          role: "user",
        })
      );
      expect(result.user.password).toBeUndefined();
      expect(result.user.__v).toBeUndefined();
    });
  });

  describe("profile", () => {
    it("returns sanitized user profile when user exists", async () => {
      const user = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "secret",
        role: "user",
        __v: 0,
      };
      userRepository.findById.mockResolvedValue(user);

      const result = await authService.profile("123");

      expect(userRepository.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(
        expect.objectContaining({
          id: "123",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          role: "user",
        })
      );
      expect(result.password).toBeUndefined();
      expect(result.__v).toBeUndefined();
    });

    it("throws 404 when user is not found", async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(authService.profile("not-found")).rejects.toMatchObject({
        message: "User Not Found",
        status: 404,
      });

      expect(userRepository.findById).toHaveBeenCalledWith("not-found");
    });
  });

  describe("sanitize", () => {
    it("removes password and __v from plain object", () => {
      const user = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "secret",
        role: "user",
        __v: 0,
      };

      const sanitized = authService.sanitize(user);

      expect(sanitized).toEqual(
        expect.objectContaining({
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          role: "user",
        })
      );
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.__v).toBeUndefined();
    });

    it("handles objects with toObject method (e.g., Mongoose document)", () => {
      const doc = {
        toObject: () => ({
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          password: "secret",
          role: "user",
          __v: 0,
        }),
      };

      const sanitized = authService.sanitize(doc);

      expect(sanitized).toEqual(
        expect.objectContaining({
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          role: "user",
        })
      );
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.__v).toBeUndefined();
    });

    it("returns empty object for invalid input", () => {
      expect(authService.sanitize(null)).toEqual({});
      expect(authService.sanitize(undefined)).toEqual({});
      expect(authService.sanitize("string")).toEqual({});
    });
  });
});
