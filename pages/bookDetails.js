import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Assuming you're using this library for cookies
import styles from '../styles/bookDetailModal.module.scss'; // Create this CSS file for styling

const StarRating = ({ rate, setRate }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rate ? styles.filledStar : styles.emptyStar}
          onClick={() => setRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const BookDetailModal = ({ book, onClose }) => {
  const [urgency, setUrgency] = useState('Medium');
  const [duration, setDuration] = useState(1); // Weeks for rent or price
  const [reason, setReason] = useState('');
  const [rate, setRate] = useState(book.rating || 0); // Initialize with book's rating

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const [userPrice, numberOfWeeks] = book.type === 'sale' ? [duration, 0] : [0, duration];
    const requestData = {
      poster_user_id: book.userId,
      book_id: book._id,
      urgencyLevel: urgency.toLowerCase(),
      numberOfWeeks: parseInt(numberOfWeeks),
      userPrice: parseInt(userPrice),
      reason,
      rating: rate, // Include the rating in the request data
    };

    const token = Cookies.get('authorization'); // Retrieve the token from cookies
    try {
      const response = await axios.post('/api/request/create', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      // Check for 400 status code and display error message
      if (response.status === 400) {
        const errorMessage = response.data.message || 'Bad Request';
        alert(`Error: ${errorMessage}`);
        return; // Stop further execution
      }
    
      if (!response.status.toString().startsWith('2')) { // Handle non-successful responses
        alert('Failed to submit the request. Please try again later.');
        return;
      }
    
      alert('Your request has been submitted!');
      onClose(); // Close the modal
    } catch (error) {
      // Handle errors during the request
      if (error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}`);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
    
  };

  if (!book) {
    return <div className={styles.modal}>Loading...</div>;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{book.title}</h2>
        <p>{book.description}</p>
        <form onSubmit={handleFormSubmit}>
          {/* Urgency Slider */}
          <div className={styles.inputGroup}>
            <label htmlFor="urgency">Urgency Level</label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className={styles.select}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Duration or Price */}
          <div className={styles.inputGroup}>
            <label htmlFor="duration">
              {book.type === 'sale' || book.type === 'rent' ? 'Price (in USD)' : 'Number of Weeks'}
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="0"
              max="52"
              className={styles.input}
            />
          </div>

          {/* Reason */}
          <div className={styles.inputGroup}>
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength="2000"
              placeholder="Explain why you need the book..."
              className={styles.textarea}
            />
            <small>{reason.length}/2000 characters</small>
          </div>

          {/* Rating */}
          <div className={styles.inputGroup}>
            <label>Rate this Book</label>
            <StarRating rate={rate} setRate={setRate} />
          </div>

          {/* Submit Button */}
          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              Submit Request
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookDetailModal;
