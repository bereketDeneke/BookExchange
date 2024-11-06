// utils/db.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    cached.promise = client.connect().then((client) => {
      console.log("Connected to MongoDB successfully!");
      return client;
    }).catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
