class BaseModel {
  static async findById(id) {
    return this.findOne({ _id: id }).exec();
  }

  static async deleteById(id) {
    return this.deleteOne({ _id: id }).exec();
  }

  static async findAll(filter = {}, sort = {}, limit = 10, skip = 0) {
    return this.find(filter).sort(sort).skip(skip).limit(limit).exec();
  }

  static async updateById(id, updateData) {
    await this.updateOne(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return this.findById(id);
  }
}

export default BaseModel;
