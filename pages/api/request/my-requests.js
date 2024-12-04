import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';
import Request from '../../../models/Request';
import BookOffer from '../../../models/Offer';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token. User not authenticated.' });
    }
    // Fetch all book requests made by the user
    const userRequests = await Request.findByRequesterUserId(userId);
    const enhancedRequests = await Promise.all(
      userRequests.map(async (request) => {
        const poster_user_id = request.poster_user_id.toString();
        const user = await User.findById(poster_user_id);
        const Book = await BookOffer.findById(request.book_id);

        const profilePicture = user.profilePicture ? `data:image/png;base64,${user.profilePicture}` : '';
        return {
          ...request,
          user: {
            id: user._id,
            name: user.username,
            profilePicture,
          },
          book: {
            id: Book._id,
            title: Book.title,
            price: Book.price,
            status: Book.status
          },
        };
      })
    );

    if (!enhancedRequests || enhancedRequests.length === 0) {
      return res.status(401).json({ message: 'No requests found for this user.' });
    }

    res.status(200).json(enhancedRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error);

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
