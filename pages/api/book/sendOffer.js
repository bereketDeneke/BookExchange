import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import BookOffer from '../../../models/Offer';
import User from '../../../models/User';
import { z } from 'zod';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

const offerSchema = z
  .object({
    title: z.string().nonempty('Title is required').max(255, 'Title cannot exceed 255 characters'),
    description: z
      .string()
      .nonempty('Description is required')
      .max(5000, 'Description exceeds the 5000 character limit'),
    type: z.enum(['free', 'rent', 'sale'], 'Invalid type. Must be "free", "rent", or "sale"'),
    price: z
      .preprocess(
        (value) => (typeof value === 'string' ? parseInt(value, 10) : value),
        z.number().optional()
      ),
  })
  .superRefine((data, ctx) => {
    // If type is 'free', price should be undefined
    if (data.type === 'free' && data.price !== undefined) {
      ctx.addIssue({
        path: ['price'],
        message: 'Price is not allowed for free offers',
      });
    }

    // If type is 'rent' or 'sale', price must be a positive number
    if ((data.type === 'rent' || data.type === 'sale') && (data.price === undefined || data.price <= 0)) {
      ctx.addIssue({
        path: ['price'],
        message: 'Price must be a positive number for rent or sale',
      });
    }
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
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
    const userId = decoded.userId;

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse and validate input using zod
    const parsedInput = offerSchema.parse(req.body);

    // Sanitize the inputs (additional layer of validation)
    const title = validator.escape(parsedInput.title);
    const description = validator.escape(parsedInput.description);
    const type = parsedInput.type;
    const price = type === 'free' ? 0 : parsedInput.price;

    // Insert the new offer into the database
    const newOffer = {
      title,
      description,
      type,
      price,
      userId,
    };

    const offerId = await BookOffer.createOffer(newOffer);

    // Update user's streaks based on the type of offer
    const streakIncrement = type === 'rent' ? 2 : type === 'free' ? 3 : 1;
    await User.updateUser(userId, { streaks: user.streaks + streakIncrement });

    // Send success response
    res.status(201).json({
      message: 'Offer created successfully',
      offerId,
    });
  } catch (error) {
    console.error('Error submitting offer:', error);

    // Handle validation errors from zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors.map((err) => err.message).join(', ') });
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
