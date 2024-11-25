// models/user.js
import dbConnect from '../utils/db';
import { ObjectId } from 'mongodb';

const databaseName = process.env.DATABAE_NAME;

// User model functions
class User {
  static async createUser({ username, email, passwordHash, salt }) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");

    // Insert a new user with the given details
    const result = await usersCollection.insertOne({
      username,
      email,
      passwordHash,
      profilePicture: 'N/A',
      streaks: 0,
      salt,
    });
    return result.insertedId; // Return the ID of the created user
  }

  static async findByEmail(email) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");

    // Find user by email
    return await usersCollection.findOne({ email });
  }

  static async findById(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");

    // Find user by ID, converting `id` to an ObjectId if it's a string
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async updateUser(id, updateData) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");

    // Update user details
    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return await this.findById(id); // Return the updated user
  }

  static async deleteUser(id) {
    const client = await dbConnect();
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");

    // Delete user by ID
    return await usersCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
