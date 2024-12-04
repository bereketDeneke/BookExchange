import React from 'react';
import styles from '../../styles/offer.module.css';

export default function ReadOfferModal({ onClose, offer }) {
  if (!offer) return null; // Return nothing if no offer is passed

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalHeader}>Offer Details</h2>

        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Book Title</label>
            <p className={styles.textDisplay}>{offer.title}</p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Book Description</label>
            <p className={styles.textDisplay}>{offer.description}</p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Type</label>
            <p className={styles.textDisplay}>{offer.type}</p>
          </div>
          {(offer.type === 'sale' || offer.type === 'rent') && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price</label>
              <p className={styles.textDisplay}>
                {offer.type === 'free' ? 'Free' : `${offer.price}`}
              </p>
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
