import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/db';
import Request from '../../../models/Request';
import BookOffer from '../../../models/Offer';

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

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
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token. User not authenticated.' });
    }

    // Validate request body
    const { requestId, status } = req.body;
    if (!requestId || !status) {
      return res.status(400).json({ message: 'Request ID and status are required.' });
    }

    // Ensure status is valid
    const validStatuses = ['approved', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    // Find the request by ID
    const existingRequest = await Request.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Ensure the user is authorized to update the status
    if (existingRequest.poster_user_id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this request.' });
    }


    // update the book status based on the request status
    const book = await BookOffer.findById(existingRequest.book_id);
    if (book) {
      const bookStatus = status === 'approved' ? 'unavailable' : 'available' ;
      await BookOffer.updateOffer(existingRequest.book_id, { status: bookStatus });
    }
    
    // Update the request status
    const updatedRequest = await Request.updateRequest(requestId, { status });
    res.status(200).json({
      message: `Request status updated to ${status} successfully.`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating request status:', error);

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
}
