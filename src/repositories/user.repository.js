import userModel from "../models/user.model.js";

class UserRepository {
  async create(userData) {
    const user = new userModel(userData);
    return user.save();
  }

  async findByEmail(email) {
    return userModel.findOne({ email }).exec();
  }

  async findById(id) {
    return userModel.findById(id).exec();
  }

  async findAll(page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    return userModel.find().skip(skip).limit(limit).exec();
  }

  async findByRole(role, page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    return userModel.find({ role }).skip(skip).limit(limit).exec();
  }

  async emailExists(email) {
    const count = await userModel.countDocuments({ email }).exec();
    return count > 0;
  }
}

export default new UserRepository();
