import BcryptUtil from "../../src/utils/bycript.util.js";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe("BcryptUtil", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("hash", () => {
        it("generates salt and hashes password", async () => {
            const password = "password123";
            const salt = "salt123";
            const hashed = "hashed123";

            bcrypt.genSalt.mockResolvedValue(salt);
            bcrypt.hash.mockResolvedValue(hashed);

            const result = await BcryptUtil.hash(password);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
            expect(result).toBe(hashed);
        });
    });

    describe("compare", () => {
        it("compares password with hash", async () => {
            const password = "password123";
            const hash = "hashed123";

            bcrypt.compare.mockResolvedValue(true);

            const result = await BcryptUtil.compare(password, hash);

            expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
            expect(result).toBe(true);
        });
    });
});
