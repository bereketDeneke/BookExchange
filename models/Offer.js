import dbConnect from '../utils/db';
import { ObjectId } from 'mongodb';

const databaseName = process.env.DATABASE_NAME;

// BookOffer model functions
class BookOffer {
  static async createOffer({ title, description, type, price, userId }) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Insert a new book offer with the given details
    const result = await bookOffersCollection.insertOne({
      title,
      description,
      rating: 1,
      status: 'available', // unavailable
      type, // "free", "rent", or "sale"
      price: type === 'free' ? 0 : price, // Ensure price is 0 for "free" type
      userId: new ObjectId(userId), // Reference to the user who created the offer
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId; // Return the ID of the created book offer
  }

  static async findById(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Find book offer by ID
    return await bookOffersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Find all book offers by a specific user
    return await bookOffersCollection.find({ userId: new ObjectId(userId) }).toArray();
  }

  static async findAll({ filter = {}, sort = {}, limit = 10, skip = 0 }) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Find all book offers with optional filters, sorting, and pagination
    return await bookOffersCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async find() {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Find all book offers with optional filters, sorting, and pagination
    return await bookOffersCollection
      .find({})
      .toArray();
  }

  static async updateOffer(id, updateData) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Update book offer details
    await bookOffersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return await this.findById(id); // Return the updated book offer
  }

  static async findById(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Find book offer by ID
    return await bookOffersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async deleteOffer(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const bookOffersCollection = db.collection("bookOffers");

    // Delete book offer by ID
    return await bookOffersCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = BookOffer;
