import AuthMiddleware from "../../src/middlewares/auth.middleware.js";
import JwtUtil from "../../src/utils/jwt.util.js";

jest.mock("../../src/utils/jwt.util.js", () => ({
    verifyToken: jest.fn(),
}));

describe("AuthMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {}, user: null };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("protect", () => {
        it("calls next and sets req.user if token is valid", () => {
            req.headers.authorization = "Bearer valid_token";
            const payload = { id: 1, role: "User" };
            JwtUtil.verifyToken.mockReturnValue(payload);

            AuthMiddleware.protect(req, res, next);

            expect(JwtUtil.verifyToken).toHaveBeenCalledWith("valid_token");
            expect(req.user).toEqual(payload);
            expect(next).toHaveBeenCalledWith(); // called without args
        });

        it("calls next with 401 error if header is missing", () => {
            req.headers.authorization = undefined;

            AuthMiddleware.protect(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Unauthorized", status: 401 })
            );
        });

        it("calls next with 401 error if header format is invalid", () => {
            req.headers.authorization = "InvalidFormat valid_token";

            AuthMiddleware.protect(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Unauthorized", status: 401 })
            );
        });

        it("calls next with error if token verification fails", () => {
            req.headers.authorization = "Bearer invalid_token";
            const error = new Error("Invalid token");
            JwtUtil.verifyToken.mockImplementation(() => {
                throw error;
            });

            AuthMiddleware.protect(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("authorizeRole", () => {
        it("calls next if user has allowed role (case insensitive)", () => {
            req.user = { role: "Admin" };
            const middleware = AuthMiddleware.authorizeRole("admin", "manager");

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it("calls next with 401 if req.user is missing", () => {
            req.user = undefined;
            const middleware = AuthMiddleware.authorizeRole("admin");

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Unauthorized", status: 401 })
            );
        });

        it("calls next with 403 if user role is not allowed", () => {
            req.user = { role: "User" };
            const middleware = AuthMiddleware.authorizeRole("admin");

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Forbidden", status: 403 })
            );
        });

        it("calls next with 403 if user has no role", () => {
            req.user = {}; // role is undefined
            const middleware = AuthMiddleware.authorizeRole("admin");

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Forbidden", status: 403 })
            );
        });

        it("calls next with error if default role processing fails (edge case)", () => {
            // Simulate an error, e.g. req.user exists but accessing role throws?
            // Hard to induce without modifying object property descriptors, 
            // but we can pass a proxy or getter that throws.
            req.user = {
                get role() { throw new Error("Access Error"); }
            };
            const middleware = AuthMiddleware.authorizeRole("admin");

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Access Error" }));
        });
    });
});
