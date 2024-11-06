// components/BookSearch.js
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header';
import { logout } from '../utils/helper';

export default function BookSearch() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState('All');
  const [scrollDirection, setScrollDirection] = useState("down");
  const bookRefs = useRef([]); // Refs for each book to apply animation


  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleStarClick = (newRating) => {
    setRating(newRating); // Update rating based on clicked star
  };

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Simulate a list of books
  const books = Array.from({ length: 50 }, (_, index) => ({
    title: `Book Title ${index + 1}`,
    description: "A brief description of the book.",
    status: "Available",
    type: "Free",
  }));


  // Scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (scrollDirection === "down") {
              entry.target.classList.add("fade-in");
              entry.target.classList.remove("pop-in");
            } else {
              entry.target.classList.add("pop-in");
              entry.target.classList.remove("fade-in");
            }
          } else {
            entry.target.classList.remove("fade-in", "pop-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    bookRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header
        profilePicture="./profile.webp"
        userName="John Doe"
        onLogout={logout}
      />
      <div style={styles.container}>
        <h1 style={styles.heading}>Find Your Next Read</h1>
        <form style={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search</button>
        </form>
        <div style={styles.filters}>
          <div style={styles.filter}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div style={styles.filter}>
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
          <div style={styles.filter}>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Rent">Rent</option>
              <option value="Sale">Sale</option>
            </select>
          </div>
        </div>

        {/* Book list container */}
        <div style={styles.bookList}>
          {books.map((book, index) => (
            <div
              key={index}
              ref={(el) => (bookRefs.current[index] = el)} // Attach ref for each book
              className="book-card"
              style={styles.bookCard}
            >
              <h2 style={styles.bookTitle}>{book.title}</h2>
              <p style={styles.bookDescription}>{book.description}</p>
              <div style={styles.bookTags}>
                <span style={styles.statusTag}>{book.status}</span>
                <span style={styles.typeTag}>{book.type}</span>
              </div>
              <button style={styles.detailsButton}>Details</button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .book-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transform: scale(0.8); /* Start slightly smaller */
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

      .fade-in {
        opacity: 1;
        transform: translateY(0);
        box-shadow: 0 0 10px rgba(66, 153, 225, 0.5); /* Initial blue glow */
        transition: box-shadow 0.5s ease; /* Fade out glow over time */
      }

      .pop-in {
        animation: balloonPop 0.5s ease forwards; /* Use balloon pop animation */
        border: 2px solid rgba(66, 153, 225, 0.7); /* Temporary border color */
      }

      /* Keyframes for the balloon pop effect */
      @keyframes balloonPop {
        0% {
          transform: scale(0.5);
          opacity: 0;
          box-shadow: 0 0 15px rgba(66, 153, 225, 0.5); /* Strong initial glow */
        }
        60% {
          transform: scale(1.2);
          opacity: 1;
          box-shadow: 0 0 8px rgba(66, 153, 225, 0.3); /* Reduced glow at peak */
        }
        100% {
          transform: scale(1);
          opacity: 1;
          box-shadow: 0 0 0 rgba(66, 153, 225, 0); /* Fade out glow completely */
        }
      }

      `}</style>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#4a3f8e', // Matches button color for consistency
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '650px',
    marginBottom: '2rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', // Adds slight shadow for emphasis
    borderRadius: '6px',                       // Rounded corners
    overflow: 'hidden',                         // Smooth edges for input and button
  },
  searchInput: {
    flex: 1,
    padding: '10px 15px',
    fontSize: '16px',
    border: '1px solid #cccccc',
    outline: 'none',
    transition: 'border 0.3s ease',
    borderRadius: '4px 0 0 4px'//,
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
    padding: '1rem 1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for elevation
  },
  filter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stars: {
    display: 'flex',
    gap: '4px',
    cursor: 'pointer',
  },
  star: {
    fontSize: '24px',
    transition: 'color 0.3s ease, transform 0.3s ease', // Smooth color and scaling transitions
    color: '#a0a0a0', // Default dull color for unselected stars
  },
  selectedStar: {
    color: '#b08d57', // Muted bronze/gold for selected stars
    transform: 'scale(1.2)', // Slight scaling for selected stars
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #cccccc',
    transition: 'border 0.3s ease',
    backgroundColor: '#f9f9f9', // Subtle background
  },
  bookList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '70vh', // Sets the max height to trigger scroll if content overflows
    width: '100%',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  bookCard: {
    width: '100%',
    maxWidth: '250px',
    padding: '1.5rem',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // More prominent shadow for depth
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  bookCardHover: {
    transform: 'scale(1.05)', // Slightly enlarge on hover for effect
  },
  bookTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '0.5rem',
  },
  bookDescription: {
    fontSize: '14px',
    color: '#555555',
    marginBottom: '1rem',
  },
  bookTags: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1rem',
    justifyContent: 'center',
  },
  statusTag: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  typeTag: {
    backgroundColor: '#2196f3',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  detailsButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  detailsButtonHover: {
    backgroundColor: '#3e3576',
    transform: 'scale(1.05)', // Button grows slightly when hovered
  },
};
