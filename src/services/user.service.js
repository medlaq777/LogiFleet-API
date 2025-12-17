import UserRepository from "../repositories/user.repository.js";

import BcryptUtil from "../utils/bycript.util.js";

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        const { firstName, lastName, email, password, role } = userData;

        if (!firstName || !lastName || !email || !password) {
            const err = new Error("Missing required fields");
            err.status = 400;
            throw err;
        }

        const userExist = await this.userRepository.findByEmail(email);
        if (userExist) {
            const err = new Error("User already exists");
            err.status = 409;
            throw err;
        }

        const hashedPassword = await BcryptUtil.hash(password, 10);
        const user = await this.userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'Driver'
        });

        return this.sanitize(user);
    }

    async getAllUsers(page, limit) {
        return this.userRepository.findAll(page, limit);
    }

    async getUsersByRole(role, page, limit) {
        return this.userRepository.findByRole(role, page, limit);
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        return this.sanitize(user);
    }

    async updateUser(id, updateData) {
        // If updating password, hash it
        if (updateData.password) {
            updateData.password = await BcryptUtil.hash(updateData.password, 10);
        }

        const user = await this.userRepository.update(id, updateData);
        if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        return this.sanitize(user);
    }

    async deleteUser(id) {
        const user = await this.userRepository.delete(id);
        if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        return { message: "User deleted successfully" };
    }

    sanitize(user) {
        const { password, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
}

export default new UserService(UserRepository);
