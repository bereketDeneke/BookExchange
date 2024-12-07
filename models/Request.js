import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const { Schema } = mongoose;

const RequestSchema = new Schema({
  requester_user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  poster_user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'bookoffers', required: true },
  urgencyLevel: { type: String, required: true },
  reason: { type: String, required: true },
  numberOfWeeks: { type: Number, required: true },
  userPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

class RequestModel extends BaseModel {
  static async createRequest({
    requester_user_id,
    poster_user_id,
    book_id,
    urgencyLevel,
    reason,
    numberOfWeeks,
    userPrice,
  }) {
    const request = await this.create({
      requester_user_id,
      poster_user_id,
      book_id,
      urgencyLevel,
      reason,
      numberOfWeeks,
      userPrice,
      status: 'pending',
    });
    return request._id;
  }

  static async findByPosterUserId(posterUserId) {
    return this.find({ poster_user_id: posterUserId }).exec();
  }

  static async findByRequesterUserId(requesterUserId) {
    return this.find({ requester_user_id: requesterUserId }).exec();
  }
}

RequestSchema.loadClass(RequestModel);

const Request = mongoose.models.requests || mongoose.model('requests', RequestSchema);
export default Request;
