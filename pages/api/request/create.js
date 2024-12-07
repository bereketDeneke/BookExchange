import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import Request from '../../../models/Request';
import BookOffer from '../../../models/Offer';
import { z } from 'zod';
import validator from 'validator';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

// Schema to validate and sanitize input
const requestSchema = z.object({
  poster_user_id: z.string().nonempty('Poster User ID is required').refine(
    (value) => /^[a-f\d]{24}$/i.test(value), 
    'Invalid Poster User ID'
  ),
  book_id: z.string().nonempty('Book ID is required').refine(
    (value) => /^[a-f\d]{24}$/i.test(value),
    'Invalid Book ID'
  ),
  urgencyLevel: z.enum(['low', 'medium', 'high'], 'Invalid urgency level'),
  reason: z.string().nonempty('Reason is required').max(1000, 'Reason cannot exceed 1000 characters'),
  numberOfWeeks: z.number().min(0, 'Number of weeks must be at least 1').optional(),
  userPrice: z.number().min(0, 'User price must be non-negative').optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'), // Add rating field
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  await dbConnect();

  try {
    // Validate the token from cookies
    const token = req.cookies.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Missing token in cookies' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const requester_user_id = decoded.userId;

    // Parse and validate input using zod
    const parsedInput = requestSchema.parse(req.body);

    // Sanitize input values
    const poster_user_id = validator.escape(parsedInput.poster_user_id);
    const book_id = validator.escape(parsedInput.book_id);
    const urgencyLevel = parsedInput.urgencyLevel;
    const reason = validator.escape(parsedInput.reason);
    const numberOfWeeks = parsedInput.numberOfWeeks;
    const userPrice = parsedInput.userPrice;
    const rating = parsedInput.rating; // Extract and validate the rating

    // Prevent a user from requesting their own book
    if (requester_user_id === poster_user_id) {
      return res.status(400).json({
        message: 'You cannot request a book that you posted.',
      });
    }

    // Ensure the book exists and belongs to the poster_user_id
    const book = await BookOffer.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId.toString() !== poster_user_id) {
      return res.status(400).json({
        message: 'Book does not belong to the specified poster user.',
      });
    }

    // Check for duplicate requests
    const existingRequest = await Request.findOne({
      requester_user_id:new ObjectId(requester_user_id),
      book_id: new ObjectId(book_id)
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'You have already requested this book.'
      });
    }

    // Create the new request
    const newRequest = await Request.createRequest({
     requester_user_id,
      poster_user_id,
      book_id,
      urgencyLevel,
      reason,
      numberOfWeeks,
      userPrice
    });

    await BookOffer.updateById(book_id, { rating });

    // Send success response
    res.status(201).json({
      message: 'Request created successfully',
      requestId: newRequest._id,
    });
  } catch (error) {
    console.error('Error creating request:', error);

    // Handle validation errors from zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
