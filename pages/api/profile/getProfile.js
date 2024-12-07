import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';
import BookOffer from '../../../models/Offer';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();

  try {
    // Validate Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user profile from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's book offers
    console.log(user._id);
    const bookOffers = await BookOffer.findByUserId(userId);

    // Send user profile along with book offers
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      streaks: user.streaks,
      email: user.email,
      profilePicture:
        user.profilePicture === 'N/A'
          ? './defaultProfile.png'
          : 'data:image/png;base64,' + user.profilePicture.toString('base64'),
      offers: bookOffers, // Include book offers in the response
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(200).json({ message: 'Error fetching profile' });
    // if (error.name === 'JsonWebTokenError') {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }
    // res.status(500).json({ message: 'Server error' });
  }
}
