class VehicleRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const items = await this.model.find().skip(skip).limit(limit);
    const total = await this.model.countDocuments();
    return { items, total };
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

export default VehicleRepository;
