import JwtUtil from "../../src/utils/jwt.util.js";
import Jwt from "jsonwebtoken";
import Config from "../../src/config/config.js";

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

jest.mock("../../src/config/config.js", () => ({
    JWTSECRET: "secret_key",
    JWTEXPIRESIN: "1h",
}));

describe("JwtUtil", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("generateToken", () => {
        it("signs payload with secret and expiration", () => {
            const payload = { id: 1 };
            const token = "token123";
            Jwt.sign.mockReturnValue(token);

            const result = JwtUtil.generateToken(payload);

            expect(Jwt.sign).toHaveBeenCalledWith(payload, "secret_key", {
                expiresIn: "1h",
            });
            expect(result).toBe(token);
        });
    });

    describe("verifyToken", () => {
        it("verifies token with secret", () => {
            const token = "token123";
            const decoded = { id: 1 };
            Jwt.verify.mockReturnValue(decoded);

            const result = JwtUtil.verifyToken(token);

            expect(Jwt.verify).toHaveBeenCalledWith(token, "secret_key");
            expect(result).toBe(decoded);
        });
    });
});
