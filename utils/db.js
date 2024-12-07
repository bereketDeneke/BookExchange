// utils/db.j
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.DB_URI || "http://localhost";

if (!MONGODB_URI) {
  throw new Error('Please define the DB_URI environment variable in .env.local');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return mongoose;
  }

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DATABASE_NAME,
    serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds instead of Mongoose's 30 seconds
    socketTimeoutMS: 45000, // Closes sockets after 45 seconds of inactivity
  });
  isConnected = true;
  console.log('Connected to MongoDB using Mongoose!');
  return mongoose;
}

export default dbConnect;
