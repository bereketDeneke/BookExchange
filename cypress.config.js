import { defineConfig } from "cypress";
import dbConnect from './utils/db.js';
import User from './models/User.js';
import Request from "./models/Request.js";
import BookOffer from "./models/Offer.js";
import dotenv from "dotenv";
dotenv.config();

console.log( `${process.env.SERVER_URL}:${process.env.PORT}`);
export default defineConfig({
  e2e: {
    baseUrl: `${process.env.SERVER_URL}:${process.env.PORT}`,
    defaultCommandTimeout: 15000, // Increase to 10 seconds
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      on('task', {
        async deleteUser(email) {
          try {
            await dbConnect();
            const result = await User.deleteOne({ email });
            return result.deletedCount > 0; // Return true if user was deleted
          } catch (error) {
            console.error('Error deleting user:', error);
            return false; // Return false if deletion failed
          }
        },

        async deleteOffer({ownerEmail, title}) {
          try {
            await dbConnect();
            const user = await User.findOne({ email: ownerEmail });
            const ownerId = user._id;
            console.log("Owner ID:", ownerId, "Title:", title);
            const result = await BookOffer.deleteMany({ userId: ownerId, title });
            return result.deletedCount > 0; // Return true if offer was deleted
          } catch (error) {
            console.error('Error deleting offer:', error);
            return false; // Return false if deletion failed
          }
        }
      });
    }
  }
});
