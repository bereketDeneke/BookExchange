import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import Request from '../../../models/Request';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
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

    // Validate request ID from the body
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }

    // Find the request to ensure it exists and belongs to the user
    const existingRequest = await Request.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (existingRequest.requester_user_id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this request.' });
    }

    // Delete the request
    await Request.deleteById(requestId);

    res.status(200).json({ message: 'Request removed successfully.' });
  } catch (error) {
    console.error('Error removing request:', error);

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
