import React from 'react';
import { useRouter } from 'next/router';
import { FaHome, FaInbox, FaListAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../utils/helper';
import { useProfile } from '../context/UserContext'; 

export default function Header() {
  const router = useRouter();
  const { profile } = useProfile(); // Access the profile from context

  const handleNavigation = (route, query = {}) => {
    router.push({ pathname: route, query });
  };

  const navigateToProfile = () => {
    // Encode the user ID in Base64
    const base64UserId = btoa(profile._id);
    handleNavigation('/profile', { user_id: base64UserId });
  };

  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        <h1 style={styles.logo} onClick={() => handleNavigation('/')}>
          BXC
        </h1>
        <nav style={styles.navMenu}>
          <div
            style={{
              ...styles.navItem,
              ...(router.pathname === '/' ? styles.activeNavItem : {}),
            }}
            onClick={() => handleNavigation('/')}
            title="Home"
          >
            <FaHome style={styles.icon} />
            <span
              style={{
                ...styles.navText,
                ...(router.pathname === '/' ? styles.activeNavItem : {}),
              }}
            >
              Home
            </span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(router.pathname === '/incomingRequests' ? styles.activeNavItem : {}),
            }}
            onClick={() => handleNavigation('/incomingRequests')}
            title="Incoming Requests"
          >
            <FaInbox style={styles.icon} />
            <span
              style={{
                ...styles.navText,
                ...(router.pathname === '/incomingRequests' ? styles.activeNavItem : {}),
              }}
            >
              Incoming Requests
            </span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(router.pathname === '/myRequests' ? styles.activeNavItem : {}),
            }}
            onClick={() => handleNavigation('/myRequests')}
            title="My Requests"
          >
            <FaListAlt style={styles.icon} />
            <span
              style={{
                ...styles.navText,
                ...(router.pathname === '/myRequests' ? styles.activeNavItem : {}),
              }}
            >
              My Requests
            </span>
          </div>
        </nav>
      </div>
      <div style={styles.profileContainer}>
        <img
          src={profile.profilePicture}
          alt="Profile"
          style={styles.profilePicture}
          onClick={navigateToProfile}
        />
        <span style={styles.userName} onClick={navigateToProfile}>
          {profile.username || 'Loading...'}
        </span>
        <button onClick={logout} style={styles.logoutButton}>
          <FaSignOutAlt style={{ color: '#dc143c', fontSize: '24px', cursor: 'pointer' }} /> Logout
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a3f8e',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  activeNavItem: {
    backgroundColor: '#4a3f8e',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  icon: {
    fontSize: '18px',
  },
  navText: {
    fontSize: '12px',
    color: '#4a3f8e',
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
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    cursor: 'pointer',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
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
};