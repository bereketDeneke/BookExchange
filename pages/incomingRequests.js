import React, { useEffect, useState } from 'react';
import styles from '../styles/IncomingRequests.module.css';
import Header from './components/header';
import axios from 'axios';
import { FaCheckDouble, FaTimes } from 'react-icons/fa'; // Icons for status

export default function IncomingRequests() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortedRequests, setSortedRequests] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/request/incoming-requests', {
          headers: { Authorization: `Bearer ${document.cookie.split('authorization=')[1]}` },
        });
        setRequests(response.data || []);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.response?.data || 'Failed to fetch requests.';
        setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter and sort requests
  useEffect(() => {
    const filterAndSortRequests = () => {
      // Filter by search term
      const filteredRequests = requests.filter((request) =>
        request.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort based on selected criteria
      const sorted = [...filteredRequests].sort((a, b) => {
        if (sortCriteria === 'urgency') {
          const urgencyOrder = { high: 1, medium: 2, low: 3 };
          return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
        } else if (sortCriteria === 'duration') {
          return a.numberOfWeeks - b.numberOfWeeks;
        }
        return 0; // No sorting
      });

      setSortedRequests(sorted);
    };

    filterAndSortRequests();
  }, [searchTerm, sortCriteria, requests]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.post('/api/request/update-status', {
        requestId: id,
        status,
      }, {
        headers: { Authorization: `Bearer ${document.cookie.split('authorization=')[1]}` },
      });

      alert(response.data.message);

      // Update the status in the UI
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message || 'Failed to update the status of the request.'
      );
    }
  };

  const handleApprove = (id) => handleStatusUpdate(id, 'approved');
  const handleDecline = (id) => handleStatusUpdate(id, 'declined');

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Incoming Requests for My Books</h1>

        {/* Search and Sort Controls */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by book title or requester name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">Sort by</option>
            <option value="urgency">Urgency</option>
            <option value="duration">Request Duration</option>
          </select>
        </div>

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
        {!loading && !error && sortedRequests.length > 0 && (
          <div className={styles.requests}>
            {sortedRequests.map((request) => (
              <div key={request._id} className={styles.requestCard}>
                <h2 className={styles.bookTitle}>Book: {request.book.title}</h2>
                <div className={styles.requestedBy}>
                  <img
                    src={request.requestedBy.profilePicture}
                    alt={request.requestedBy.name}
                    className={styles.profilePicture}
                  />
                  <span className={styles.userName}>{request.requestedBy.name}</span>
                </div>
                {request.userPrice === 0 ? (
                  <p>
                    <strong>Requested Duration:</strong> {`${request.numberOfWeeks} weeks`}
                  </p>
                ) : (
                  <p>
                    <strong>Buyer’s Proposed Price:</strong> ${request.userPrice}
                  </p>
                )}
                <p>
                  <strong>Urgency:</strong> {request.urgencyLevel}
                </p>
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>

                {/* Action Buttons with Watermarks */}
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.approveButton} ${
                      request.status === 'approved' ? styles.greyedButton : ''
                    }`}
                    onClick={() => handleApprove(request._id)}
                  >
                    {request.status === 'approved' && (
                      <FaCheckDouble className={styles.iconApproved} />
                    )}
                    Approve
                  </button>
                  <button
                    className={`${styles.declineButton} ${
                      request.status === 'declined' ? styles.greyedButton : ''
                    }`}
                    onClick={() => handleDecline(request._id)}
                  >
                    {request.status === 'declined' && (
                      <FaTimes className={styles.iconDeclined} />
                    )}
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && sortedRequests.length === 0 && (
          <div className={styles.noRequests}>No requests found.</div>
        )}
      </div>
    </>
  );
}
