// pages/api/auth/register.js
import bcrypt from 'bcrypt';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';
import { z } from 'zod'; // Use Zod for input validation
import validator from 'validator'; // Use validator for sanitizing inputs

// Define schema for validation with Zod
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username should have at least 3 characters")
    .max(30, "Username should not exceed 30 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => validator.isEmail(email), { message: "Invalid email format" }),
  password: z
    .string()
    .min(8, "Password should have at least 8 characters")
    .regex(/[A-Z]/, "Password should have at least one uppercase letter")
    .regex(/[a-z]/, "Password should have at least one lowercase letter")
    .regex(/[0-9]/, "Password should have at least one number")
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    try {
      // Validate input with schema
      const { username, email, password } = userSchema.parse(req.body);

      // Sanitize inputs to prevent injection attacks
      const sanitizedUsername = validator.escape(username);
      const sanitizedEmail = validator.normalizeEmail(email);

      // Check if the user already exists
      const existingUser = await User.findByEmail(sanitizedEmail);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password + sanitizedEmail, salt); // Adding email for extra entropy

      // Save the user with hashed password and salt
      await User.createUser({
        username: sanitizedUsername,
        email: sanitizedEmail,
        passwordHash,
        salt,
      });

      // Send success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ message: error.errors.map(err => err.message) });
      }
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
