import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useProfile } from './context/UserContext';
import styles from '../styles/Profile.module.css';
import Header from './components/header';
import { logout } from '../utils/helper';
import OfferModal from './components/offerModal';
import ReadOfferModal from './components/offerDetail';

const ProfileCard = () => {
  const [profilePicture, setProfilePicture] = useState('/defaultProfile.png'); // Default profile picture
  const [fullname, setFullname] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [streaks, setStreaks] = useState(0);
  const [offers, setOffers] = useState([]); // New state for book offers
  const { profile, setProfile } = useProfile();
  const router = useRouter();
  
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Handle search and filtering
  let filteredBooks = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch profile and offers information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('authorization'); // Retrieve the token from cookies
        const response = await axios.get('/api/profile/getProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { profilePicture, email, streaks, username, offers } = response.data;
        setFullname(username);
        setStreaks(streaks);
        setEmail(email);
        setProfilePicture(profilePicture);
        setOffers(offers || []); // Set offers data, default to empty array if undefined

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

      setProfile({
        username: fullname,
        profilePicture: profilePicture || './defaultProfile.png',
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

  const handleAddBookClick = (status) => {
    setShowModal(status);
  };

  const navigateToBook = async (id) => {
    try {
      // Make a fetch request to get the book details
      const response = await fetch(`/api/book/getDetails?book_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for token validation
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Handle errors returned from the server
        throw new Error(result.message || 'An error occurred while fetching the book details');
      }
  
      // Pass the fetched data to the openModal function
      openModal(result);
    } catch (error) {
      // Show an alert or handle the error appropriately
      alert(`Failed to fetch book details: ${error.message}`);
    }
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
          {filteredBooks.map((offer) => (
              <div
                key={offer._id}
                className={styles.bookCard}
                onClick={() => navigateToBook(offer._id)}
              >
                <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>{offer.title}</h4>
                <p style={{ fontSize: '14px', marginBottom: '4px', color: '#555' }}>Type: {offer.type}</p>
                <p style={{ fontSize: '14px', marginBottom: '0', color: '#555' }}>
                  {offer.type === 'free' ? '' : `Price: $${offer.price}`}
                </p>
              </div>
            ))}

            {/* Floating Plus Button */}
            <div
                key='addBook'
                className={styles.addBookButton}
                onClick={()=>handleAddBookClick(true)}
              >
                <h4>+</h4>
              </div>
          </div>
        </div>
      </div>

      {isModalOpen && <ReadOfferModal onClose={closeModal} offer={modalData} />}
      {showModal && <OfferModal onClose={()=>handleAddBookClick(false)} />}
    </>
  );
};

// export {getServerSideProps};
export default ProfileCard;
