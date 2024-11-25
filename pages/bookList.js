import React, { useState, useRef, useEffect } from 'react';
import Header from './components/header';
import { getServerSideProps, logout } from '../utils/helper';
import Cookies from 'js-cookie';
import axios from 'axios';


export {getServerSideProps};

export default function BookSearch() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState('All');
  const [books, setBooks] = useState([]); // State to store books with consistent ratings
  const bookRefs = useRef([]);
  const [profilePicture, setProfilePicture] = useState('./defaultProfile.png');
  const [username, setUsername] = useState('');


  // Generate books with consistent ratings on the client side
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('authorization'); // Retrieve the token from cookies
        console.log('token', token);
        const response = await axios.get('/api/profile/getProfile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { username, profilePicture } = response.data;
        setUsername(username);
        setProfilePicture(profilePicture);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();

    const generatedBooks = Array.from({ length: 50 }, (_, index) => ({
      title: `Book Title ${index + 1}`,
      description: 'A brief description of the book.',
      status: index % 2 === 0 ? 'Available' : 'Unavailable',
      type: index % 3 === 0 ? 'Free' : index % 3 === 1 ? 'Rent' : 'Sale',
      rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    }));
    setBooks(generatedBooks);
  }, []); // Runs only once on component mount

  // Filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All' || book.status === status;
    const matchesType = type === 'All' || book.type === type;
    const matchesRating = rating === 0 || book.rating >= rating;

    return matchesSearch && matchesStatus && matchesType && matchesRating;
  });

  const handleStarClick = (newRating) => {
    setRating(newRating);
  };

  return (
    <>
      <Header
        profilePicture={profilePicture || './defaultProfile.png'}
        userName={username || 'Full Name'}
        onLogout={logout}
      />
      <div style={styles.container}>
        {/* Filter Bar */}
        <div style={{ position: 'fixed', width: '93vw', height: '300px', zIndex: 10}}>
          <div style={styles.filterBar}>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={styles.searchIcon}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            <div style={styles.filterOptions}>
              <div style={styles.filterGroup}>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={styles.select}
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label>Rating</label>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleStarClick(star)}
                      style={{
                        ...styles.star,
                        ...(star <= rating && styles.selectedStar),
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.filterGroup}>
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={styles.select}
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Rent">Rent</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Book List */}
        <div style={styles.bookList}>
          {filteredBooks.map((book, index) => (
            <div
              key={index}
              ref={(el) => (bookRefs.current[index] = el)}
              className="book-card"
              style={styles.bookCard}
            >
              <h2 style={styles.bookTitle}>{book.title}</h2>
              <p style={styles.bookDescription}>{book.description}</p>
              <div style={styles.bookTags}>
                <span style={styles.statusTag}>{book.status}</span>
                <span style={styles.typeTag}>{book.type}</span>
              </div>
              <div style={styles.bookRating}>
                {'★'.repeat(book.rating).padEnd(5, '☆')}
              </div>
              <button style={styles.detailsButton}>Details</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    marginTop: '60px',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  filterBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '0',
    zIndex: 10,
  },
  
  searchContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    outline: 'none',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#4a3f8e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  searchIcon: {
    width: '18px',
    height: '18px',
    color: '#ffffff', // Matches the button text color
  },
  filterOptions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  stars: {
    display: 'flex',
    gap: '4px',
  },
  star: {
    fontSize: '24px',
    color: '#cccccc',
    cursor: 'pointer',
  },
  selectedStar: {
    color: '#FFD700',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cccccc',
  },
  bookList: {
    zIndex: 1,
    marginTop: '200px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    width: '100%',
  },
  bookCard: {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
  },
  bookCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  bookDescription: {
    fontSize: '14px',
    marginBottom: '1rem',
  },
  bookTags: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  statusTag: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '12px',
  },
  typeTag: {
    backgroundColor: '#2196f3',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '12px',
  },
  bookRating: {
    fontSize: '14px',
    color: '#FFD700',
    marginBottom: '1rem',
  },
  detailsButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
