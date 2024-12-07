import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const { Schema } = mongoose;

const BookOfferSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  rating: { type: Number, default: 1 },
  status: { type: String, default: 'available' },
  type: { type: String, enum: ['free', 'rent', 'sale'], required: true },
  price: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BookOfferModel = Object.create(BaseModel);
BookOfferModel.createOffer = async function ({ title, description, type, price, userId }) {
  const offer = await this.create({
    title,
    description,
    rating: 1,
    status: 'available',
    type,
    price: type === 'free' ? 0 : price,
    userId,
  });
  return offer._id;
};

BookOfferModel.findByUserId = async function (userId) {
  return this.find({ userId });
};


BookOfferSchema.loadClass(BookOfferModel);

const BookOffer = mongoose.models.bookOffers || mongoose.model('bookOffers', BookOfferSchema);
export default BookOffer;
