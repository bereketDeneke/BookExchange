// Import Mongoose
import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    salt:{
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: "defaultProfile.png", // stores profile pictures in base64 format
    },
    streaks: {
        type: Number,
        default: 0,
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
    memberSince: {
        type: Date,
        default: Date.now
    }
});

// Book Schema
const BookSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        default: "Unknown"
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Rented', 'Not Available'],
        default: 'Available'
    },
    type: {
        type: String,
        enum: ['Free', 'Rent', 'Giveaway', 'Sale'],
        required: true,
    },
    duration: {
        type: String,
        default: "Not specified"
    },
    image: {
        type: String,
        default: "defaultBookImage.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
    recommendations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
    }],
    history: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        interactionType: {
            type: String,
            enum: ['Rented', 'Purchased'],
            required: true
        },
        feedback: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

// Request Schema
const RequestSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined', 'Cancelled'],
        default: 'Pending'
    },
    rentalDuration: {
        type: String,
        required: true,
    },
    urgency: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now
    }
});

// Recommendation Schema
const RecommendationSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export Models
const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);
const Request = mongoose.model('Request', RequestSchema);
const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

export { connectDB, User, Book, Request, Recommendation };
