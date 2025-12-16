import UserRepository from "../repositories/user.repository.js";

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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

    sanitize(user) {
        const { password, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
}

export default new UserService(UserRepository);
