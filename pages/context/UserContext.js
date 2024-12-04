import React, { createContext, useContext, useState, useEffect, route } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getServerSideProps, logout } from '../../utils/helper';

// Create the UserContext
const UserContext = createContext();

export { getServerSideProps };
export const useProfile = () => useContext(UserContext);

// Provide the context to the app
export function UserProvider({ children }) {
  const [profile, setProfile] = useState({
    username: '',
    profilePicture: './defaultProfile.png',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
        // Avoid recursive calls when the user is already on the login page
      try {
        const token = Cookies.get('authorization');
        const response = await axios.get('/api/profile/getProfile', {
        headers: { Authorization: `Bearer ${token}` },
        });

        const { username, profilePicture } = response.data;
        setProfile({
            username,
            profilePicture: profilePicture || './defaultProfile.png',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        logout();
      }
    };

    if (!(router.pathname === '/login' || router.pathname === '/register')) {
        fetchProfile();
    }
  }, [profile.username, setProfile]);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}
