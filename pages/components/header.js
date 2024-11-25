import React from 'react';
import { useRouter } from 'next/router';

export default function Header({ profilePicture, userName, onLogout }) {
  const router = useRouter();

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        <h1 style={styles.logo} onClick={() => handleNavigation('/')}>
          BXC
        </h1>
        <nav style={styles.navMenu}>
          <span
            style={{
              ...styles.navItem,
              ...(router.pathname === '/' ? styles.activeNavItem : {}),
            }}
            onClick={() => handleNavigation('/')}
          >
            Home
          </span>
          <span
            style={{
              ...styles.navItem,
              ...(router.pathname === '/incoming-requests'
                ? styles.activeNavItem
                : {}),
            }}
            onClick={() => handleNavigation('/incoming-requests')}
          >
            Incoming Requests
          </span>
          <span
            style={{
              ...styles.navItem,
              ...(router.pathname === '/my-requests' ? styles.activeNavItem : {}),
            }}
            onClick={() => handleNavigation('/my-requests')}
          >
            My Requests
          </span>
        </nav>
      </div>
      <div style={styles.profileContainer}>
        <img
          src={profilePicture}
          alt="Profile"
          style={styles.profilePicture}
          onClick={() => handleNavigation('/profile')}
        />
        <span style={styles.userName} onClick={() => handleNavigation('/profile')}>
          {userName}
        </span>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 2rem',
    background: 'linear-gradient(135deg, #f5f6f8, #ffffff)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds depth
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    height: '60px',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#4a3f8e',
    cursor: 'pointer',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navItem: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  activeNavItem: {
    backgroundColor: '#4a3f8e',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Adds a slight depth
  },
  navItemHover: {
    backgroundColor: '#e2e4e8', // Lighter background for hover
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
    border: '2px solid #4a3f8e',
    cursor: 'pointer',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#3b3474',
  },
};
