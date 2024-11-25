import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';
import { z } from 'zod';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

// Schema for profile update validation
const profileSchema = z.object({
  fullname: z.string().nonempty('Username is required'),
  profilePicture: z.string().optional(), // Optional base64 image string
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

    // Validate request body with schema
    const {fullname, profilePicture } = profileSchema.parse(req.body);

    // Sanitize inputs to prevent injection attacks
    const sanitizedFullname = validator.escape(fullname);
    const is_safe = profilePicture == 'N/A' || validator.isBase64(profilePicture);
    const sanitizedProfilePicture = is_safe ? profilePicture : 'N/A';

    // Update user profile in the database
    const updatedUser = await User.updateUser(
      userId,
      {
        username: sanitizedFullname,
        profilePicture: sanitizedProfilePicture ,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors.map(err => err.message) });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}
