import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import Header from './components/header';
import { getServerSideProps, logout } from '../utils/helper';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProfileCard = () => {
  const [profilePicture, setProfilePicture] = useState('/defaultProfile.png'); // Default profile picture
  const [fullname, setFullname] = useState('');
  const [email, setEmail ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [streaks, setStreaks] = useState(0); // Example streaks value
  const router = useRouter();

  // List of books with IDs
  const books = [
    { id: 1, name: 'To Kill a Mockingbird' },
    { id: 2, name: 'The Catcher in the Rye' },
    { id: 3, name: '1984' },
    { id: 4, name: 'Pride and Prejudice' },
    { id: 5, name: 'The Great Gatsby' },
    { id: 6, name: 'Moby Dick' },
    { id: 7, name: 'War and Peace' },
    { id: 8, name: 'Jane Eyre' },
    { id: 9, name: 'Brave New World' },
    { id: 10, name: 'The Hobbit' },
  ];

  // Handle search and filtering
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch profile information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('authorization'); // Retrieve the token from cookies
        const response = await axios.get('/api/profile/getProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { profilePicture, email, streaks, username } = response.data;
        setFullname(username);
        setStreaks(streaks);
        setEmail(email);
        setProfilePicture(profilePicture);

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Update profile information
  const handleUpdateProfile = async () => {
    try {
      const token = Cookies.get('authorization'); // Retrieve the token from cookies
      if (fullname.trim().length <= 3) {
        alert('Full name is required');
        return;
      }

      const updateData = {
        fullname,
        profilePicture: profilePicture.startsWith('data:image')
          ? profilePicture.split(',')[1] // Extract base64 data if it's a custom image
          : 'N/A', // Do not send the default profile path as base64
      };

      await axios.post('/api/profile/updateProfile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Handle profile picture upload
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigateToBook = (id) => {
    router.push(`/bookDetails/book?id=${id}`);
  };

  return (
    <>
      <Header
        profilePicture={profilePicture || './defaultProfile.png'}
        userName={fullname || 'Full Name'}
        onLogout={logout}
      />
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            <img src={profilePicture} alt="Profile" className={styles.profileImage} />
            <label htmlFor="profilePicInput" className={styles.cameraIcon}>
              📸
            </label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handlePictureChange}
            />
          </div>
          <div className={styles.profileInfo}>
            <h2> {fullname || 'Loading...'}</h2>
            <span className={styles.streaks}>🔥 {streaks} Streaks</span>
          </div>
        </div>
        <div className={styles.profileForm}>
          <h3>Your Profile</h3>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              disabled={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <button
            className={styles.updateButton}
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
        </div>

        {/* Separate Books Section */}
        <div className={styles.booksContainer}>
          <h3>Your Book Collection</h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.booksGrid}>
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className={styles.bookCard}
                onClick={() => navigateToBook(book.id)}
              >
                <h4>{book.name}</h4>
                <p>Book ID: {book.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export {getServerSideProps};
export default ProfileCard;
