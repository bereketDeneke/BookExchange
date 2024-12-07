// pages/api/auth/login.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db.js';
import User from '../../../models/User';
import { serialize } from 'cookie';
import { z } from 'zod';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

// Define schema for validation with Zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => validator.isEmail(email), { message: "Invalid email format" }),
  password: z
    .string()
    .min(8, "Password should have at least 8 characters")
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    try {
      // Validate input with schema
      const { email, password, rememberMe } = loginSchema.parse(req.body);

      // Sanitize inputs to prevent injection attacks
      const sanitizedEmail = validator.normalizeEmail(email);

      // Check if the user exists
      const user = await User.findByEmail(sanitizedEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      // Hash the input password and compare with stored hash
      const hashedPassword = await bcrypt.hash(password + sanitizedEmail, user.salt);
      if (hashedPassword !== user.passwordHash) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: rememberMe ? '7d' : '1h' } // Set token expiry based on "Remember Me"
      );

      // Set cookie options
      const cookieOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 : 60 * 60, // 7 days or 1 hour
      };

      // Set the JWT in a cookie
      res.setHeader('Set-Cookie', serialize('authorization', token, cookieOptions));

      // Send success response
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ message: error.errors.map(err => err.message) });
      }
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
