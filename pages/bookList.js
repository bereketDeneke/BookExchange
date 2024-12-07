import React, { useState, useRef, useEffect } from 'react';
import Header from './components/header';
import { getServerSideProps, logout } from '../utils/helper';
import Cookies from 'js-cookie';
import axios from 'axios';
import BookDetailModal from './bookDetails';
import styles from '../styles/bookList.module.scss';

export default function BookSearch() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState('All');
  const [books, setBooks] = useState([]);
  const bookRefs = useRef([]);
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = Cookies.get('authorization');
        const booksResponse = await fetch('/api/book/getAllBooks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!booksResponse.ok) {
          console.error('Failed to fetch books');
        }

        const data = await booksResponse.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All' || book.status === status.toLowerCase();
    const matchesType = type === 'All' || book.type === type.toLowerCase();
    const matchesRating = rating === 0 || book.rating >= rating;

    return matchesSearch && matchesStatus && matchesType && matchesRating;
  });

  const handleStarClick = (newRating) => {
    setRating(newRating);
  };

  const handleModalClose = () => {
    setSelectedBookDetail(null);
  };

  return (
    <>
      <Header onLogout={logout} />
      <div className={styles.container}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.searchIcon}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <div className={styles.filterOptions}>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.select}
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Rating</label>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`${styles.star} ${star <= rating ? styles.selectedStar : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={styles.select}
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Rent">Rent</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Book List */}
        <div className={styles.bookList}>
          {filteredBooks.map((book, index) => (
            <div
              key={index}
              ref={(el) => (bookRefs.current[index] = el)}
              className={`${styles.bookCard} book-card`}
              
            >
              <h2 className={`${styles.bookTitle} bookTitle`}>{book.title}</h2>
              <p className={styles.bookDescription}>{book.description}</p>
              <div className={styles.bookTags}>
                <span className={styles.statusTag}>{book.status}</span>
                <span className={styles.typeTag}>{book.type}</span>
              </div>

              <span className={styles.priceTag}>
                {book.type === 'rent'
                  ? `Weekly Rental Fee: $${book.price}`
                  : `Book Price: $${book.price}`}
              </span>

              <div className={styles.bookRating}>
                {'★'.repeat(book.rating).padEnd(5, '☆')}
              </div>
              <button
                className={styles.detailsButton}
                onClick={() => setSelectedBookDetail(book)}
              >
                Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBookDetail && <BookDetailModal book={selectedBookDetail} onClose={handleModalClose} />}
    </>
  );
}
