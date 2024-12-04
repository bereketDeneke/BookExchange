import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import BookOffer from '../../../models/Offer';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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

    // Validate and sanitize `book_id` from query parameters
    const querySchema = z.object({
      book_id: z.string().nonempty('Book ID is required').regex(/^[a-fA-F0-9]{24}$/, 'Invalid Book ID'),
    });

    const { book_id } = querySchema.parse(req.query);

    // Fetch book details from the database
    const book = await BookOffer.findById(book_id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Ensure the requesting user has access to view the book details
    if (book.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to view this book' });
    }

    // Send book details
    res.status(200).json({
      book_id: book._id,
      title: book.title,
      description: book.description,
      type: book.type,
      price: book.type === 'free' ? 'Free' : `$${book.price}`,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching book details:', error);

    // Handle zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
