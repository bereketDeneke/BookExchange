import React, { useState } from 'react';
import styles from '../../styles/offer.module.css';

export default function OfferModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('free');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [message, setMessage] = useState(null); // Message to display server response
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleDescriptionChange = (e) => {
    const input = e.target.value;
    if (input.length <= 5000) {
      setDescription(input);
      setCharacterCount(input.length);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required.' });
      return;
    }
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Description is required.' });
      return;
    }
    if ((type === 'rent' || type === 'sale') && (!price || price <= 0)) {
      setMessage({ type: 'error', text: 'Price must be a positive number.' });
      return;
    }

    setIsSubmitting(true); // Set loading state
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch('/api/book/sendOffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for token
        body: JSON.stringify({
          title,
          description,
          type,
          price: type === 'free' ? undefined : price,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      setMessage({ type: 'success', text: 'Offer created successfully!' });
      setTitle('');
      setDescription('');
      setType('free');
      setPrice('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalHeader}>Add New Book</h2>

        {message && (
          <div
            className={`${styles.messageBox} ${
              message.type === 'success' ? styles.success : styles.error
            }`}
          >
            {message.text}
          </div>
        )}

        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>
              Book Title
            </label>
            <input
              type="text"
              id="title"
              className={styles.input}
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              Book Description
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="Enter book description (max 5000 characters)"
              value={description}
              onChange={handleDescriptionChange}
            />
            <div className={styles.characterCount}>
              {characterCount}/5000 characters
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.formLabel}>
              Type
            </label>
            <select
              id="type"
              className={styles.input}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="free">Free</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          {(type === 'sale' || type === 'rent') && (
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.formLabel}>
                Price (in USD) {type === 'rent' ? 'per week' : ''}
              </label>
              <input
                type="number"
                id="price"
                min={0}
                max={1000}
                className={styles.input}
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
