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

const RequestModel = Object.create(BaseModel);
RequestModel.createRequest = async function ({
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
};

RequestModel.findByPosterUserId = async function (posterUserId) {
  return this.find({ poster_user_id: posterUserId });
};

RequestModel.findByRequesterUserId = async function (requesterUserId) {
  return this.find({ requester_user_id: requesterUserId });
};


RequestSchema.loadClass(RequestModel);

const Request = mongoose.models.requests || mongoose.model('requests', RequestSchema);
export default Request;
