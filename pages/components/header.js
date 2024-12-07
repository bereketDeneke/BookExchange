import React from 'react';
import { useRouter } from 'next/router';
import { FaHome, FaInbox, FaListAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../utils/helper';
import { useProfile } from '../context/UserContext'; 
import styles from '../../styles/header.module.scss';

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
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo} onClick={() => handleNavigation('/')}>
          BXC
        </h1>
        <nav className={styles.navMenu}>
          <div
            className={`${styles.navItem} ${
              router.pathname === '/' ? styles.activeNavItem : ''
            }`}
            onClick={() => handleNavigation('/')}
            title="Home"
          >
            <FaHome className={styles.icon} />
            <span className={`${styles.navText} ${
              router.pathname === '/' ? styles.activeNavItem : ''
            }`}>
              Home
            </span>
          </div>
          <div
            className={`${styles.navItem} ${
              router.pathname === '/incomingRequests' ? styles.activeNavItem : ''
            }`}
            onClick={() => handleNavigation('/incomingRequests')}
            title="Incoming Requests"
          >
            <FaInbox className={styles.icon} />
            <span className={`${styles.navText} ${
              router.pathname === '/incomingRequests' ? styles.activeNavItem : ''
            }`}>
              Incoming Requests
            </span>
          </div>
          <div
            className={`${styles.navItem} ${
              router.pathname === '/myRequests' ? styles.activeNavItem : ''
            }`}
            onClick={() => handleNavigation('/myRequests')}
            title="My Requests"
          >
            <FaListAlt className={styles.icon} />
            <span
              className={`${styles.navText} ${
                router.pathname === '/myRequests' ? styles.activeNavItem : ''
              } myRequests`}
            >
              My Requests
            </span>
          </div>
        </nav>
      </div>
      <div className={styles.profileContainer}>
        <img
          className={styles.profilePicture}
          src={profile.profilePicture}
          alt="Profile"
          id="profilePicture"
          onClick={navigateToProfile}
        />
        <span className={styles.userName} onClick={navigateToProfile}>
          {profile.username || 'Loading...'}
        </span>
        <button onClick={logout} className={styles.logoutButton}>
          <FaSignOutAlt style={{ color: '#dc143c', fontSize: '24px', cursor: 'pointer' }} /> Logout
        </button>
      </div>
    </header>
  );
}
