// components/Header.js
import React from 'react';

export default function Header({ profilePicture, userName, onLogout }) {
  return (
    <header style={styles.header}>
      <div style={styles.profileContainer}>
        <img src={profilePicture} alt="Profile" style={styles.profilePicture} />
        <span style={styles.userName}>{userName}</span>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "fixed",          // Fixed positioning to remove from document flow
    top: "1rem",                 // Position 1rem from the top
    right: "1rem",               // Position 1rem from the right
    maxWidth: 'max-content',     // Adjust width based on content
    padding: '1rem 1.5rem', // Adds padding around the content
    margin: '1rem 1rem 1rem auto', // Positioned to the right with some margin
    background: 'linear-gradient(135deg, #f0f2f5, #d9dce1)', // Smooth gradient
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  profilePicture: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #4a3f8e', // Border color matches theme
  },
  userName: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e', // Matches theme
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#3b3474',
  },
};
