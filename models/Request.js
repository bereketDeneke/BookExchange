import dbConnect from '../utils/db';
import { ObjectId } from 'mongodb';

const databaseName = process.env.DATABASE_NAME;

// Request model functions
class Request {
  static async createRequest({
    requester_user_id,
    poster_user_id,
    book_id,
    urgencyLevel,
    reason,
    numberOfWeeks,
    userPrice = 0,
  }) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Insert a new request with the given details
    const result = await requestsCollection.insertOne({
      requester_user_id: new ObjectId(requester_user_id), // Reference to the requesting user
      poster_user_id: new ObjectId(poster_user_id), // Reference to the poster user
      book_id: new ObjectId(book_id), // Reference to the book offer
      urgencyLevel: urgencyLevel.toLowerCase(), // Ensure enum values match the schema
      reason,
      numberOfWeeks,
      userPrice,
      status: 'pending', // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return result.insertedId; // Return the ID of the created request
  }

  static async findById(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Find request by ID
    return await requestsCollection.findOne({ _id: new ObjectId(id) });
  }

  static async findByRequesterUserId(userId) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Find all requests by the requester user
    return await requestsCollection
      .find({ requester_user_id: new ObjectId(userId) })
      .toArray();
  }

  static async findByPosterUserId(userId) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Find all requests by the poster user
    return await requestsCollection
      .find({ poster_user_id: new ObjectId(userId) })
      .toArray();
  }

  static async findAll({ filter = {}, sort = {}, limit = 10, skip = 0 }) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Find all requests with optional filters, sorting, and pagination
    return await requestsCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }


  static async findOne(filter) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");
  
    // Find a single request matching the filter
    return await requestsCollection.findOne(filter);
  }
  

  static async updateRequest(id, updateData) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Update request details
    await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return await this.findById(id); // Return the updated request
  }

  static async deleteRequest(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const requestsCollection = db.collection("requests");

    // Delete request by ID
    return await requestsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Request;
