import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/MyRequests.module.css';
import Header from './components/header';

export default function MyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const authToken = document.cookie.split('authorization=')[1];
        if (!authToken) {
          throw new Error('Authorization token is missing.');
        }

        const response = await axios.get('/api/request/my-requests', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status.toString().startsWith('2')) {
          setRequests(response.data || []);
        } else {
          setError(response.response?.data?.message || 'Failed to fetch requests.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await axios.delete('/api/request/remove', {
        data: { requestId: id }, // Pass the request ID in the request body
        headers: { Authorization: `Bearer ${document.cookie.split('authorization=')[1]}` },
      });
  
      alert(response.data.message);
  
      // Remove the deleted request from the state
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== id)
      );
    } catch (error) {
      alert(
        error.response?.data?.message || 'Failed to remove the request.'
      );
    }
  };
  
  return (
    <>
      <Header />
      <div className={styles.container}>
        {loading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        {!loading && !error && requests.length === 0 && (
          <div className={styles.noRequests}>
            <p>No requests found. Start making requests to see them here.</p>
          </div>
        )}
        {!loading && !error && requests.length > 0 && (
          <div className={styles.requests}>
            {requests.map((request) => (
              <div key={request.id} className={styles.requestCard}>
                <div
                  className={styles.userInfo}
                >
                  <img
                    src={request.user.profilePicture || '/defaultProfile.png'}
                    alt={request.user.name}
                    className={styles.profilePicture}
                  />
                  <span className={styles.userName}>{request.user.name}</span>
                  <span className={styles.userName}>{request.user.email}</span>
                </div>
                <h2 className={styles.bookTitle}>
                  Request for: <i>{request.book.title}</i>
                </h2>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                {request.userPrice === 0 ? (
                  <p>
                    <strong>Requested Duration:</strong> {`${request.numberOfWeeks} weeks`}
                  </p>
                ) : (
                  <p>
                     <p>
                  <strong>Buyer’s Proposed Price:</strong> ${request.userPrice}
                </p>
                <p>
                  <strong>Original Price:</strong> ${request.book.price}
                </p>
                
                  </p>
                )}
                <p>
                  <strong>Urgency:</strong> {request.urgencyLevel}
                </p>
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>
                <div className={styles.actionButtons}>
                  {request.status === 'pending' ? (
                    <button
                      className={styles.viewButton}
                      onClick={() => handleRemove(request._id)}
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      className={styles.viewButton}
                      onClick={() => handleRemove(request._id)}
                    >
                      Remove Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
