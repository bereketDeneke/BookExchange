import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getServerSideProps } from '../utils/helper';
import { useProfile } from './context/UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../styles/login.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { profile, setProfile } = useProfile();
  const router = useRouter();

  const handleProfileHeader = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await response.json();
    if (response.ok) {
      setSuccess('Login successful');
      setError('');

      handleProfileHeader();
      router.push('/');
    } else {
      setError(data.message);
      setSuccess('');
    }
  };

  return (
    <div className={`${styles.container} flex justify-center items-center h-screen bg-gray-100`}>
      <div
        className={`${styles.card} w-full max-w-md p-8 rounded-lg shadow-lg bg-white text-center`}
      >
        <h2 className={`${styles.heading} text-2xl font-bold mb-4`}>Login</h2>
        <form className={`${styles.form} flex flex-col`} onSubmit={handleSubmit}>
          <label className={`${styles.label} text-left text-sm mb-2 text-gray-700`}>Email</label>
          <input
            type="email"
            className={`${styles.input} p-2 mb-4 text-lg border rounded-lg border-gray-300 focus:outline-none`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={`${styles.label} text-left text-sm mb-2 text-gray-700`}>Password</label>
          <input
            type="password"
            className={`${styles.input} p-2 mb-4 text-lg border rounded-lg border-gray-300 focus:outline-none`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={`${styles.checkboxContainer} flex items-center mb-4`}>
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="rememberMe"
              className={`${styles.checkboxLabel} text-sm text-gray-700`}
            >
              Remember Me
            </label>
          </div>

          {error && <p className={`${styles.error} text-red-500 text-sm mb-4`} id='error'>{error}</p>}
          {success && <p className={`${styles.success} text-green-500 text-sm mb-4`} id='success' >{success}</p>}

          <button
            type="submit"
            className={`${styles.button} p-2 text-lg font-bold text-white bg-purple-700 rounded-lg hover:bg-purple-600 transition-colors`}
          >
            Login
          </button>
        </form>
        <p className={`${styles.footerText} mt-4 text-sm text-gray-600`}>
          Need to create an account?{' '}
          <a
            href="/register"
            className={`${styles.link} font-bold text-purple-700 hover:underline`}
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

export { getServerSideProps };
