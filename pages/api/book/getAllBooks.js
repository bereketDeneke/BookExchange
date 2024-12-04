import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import BookOffer from '../../../models/Offer';

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

    // Fetch all books from the database
    const books = await BookOffer.find();

    // Return the list of books
    res.status(200).json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);

    // Handle token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
