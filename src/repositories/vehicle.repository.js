class VehicleRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.model.find().skip(skip).limit(limit);
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
