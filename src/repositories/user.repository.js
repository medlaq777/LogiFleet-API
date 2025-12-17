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

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const items = await userModel.find().skip(skip).limit(limit).exec();
    const total = await userModel.countDocuments().exec();
    return { items, total };
  }

  async findByRole(role, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const items = await userModel.find({ role }).skip(skip).limit(limit).exec();
    const total = await userModel.countDocuments({ role }).exec();
    return { items, total };
  }

  async emailExists(email) {
    const count = await userModel.countDocuments({ email }).exec();
    return count > 0;
  }

  async update(id, updateData) {
    return userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id) {
    return userModel.findByIdAndDelete(id).exec();
  }
}

export default new UserRepository();
