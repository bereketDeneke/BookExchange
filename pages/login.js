import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getServerSideProps } from '../utils/helper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

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
      router.push('/');

    } else {
      setError(data.message);
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" style={styles.checkboxLabel}>Remember Me</label>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.footerText}>
          Need to create an account? <a href="/register" style={styles.link}>Create Account</a>
        </p>
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    marginBottom: '0.5rem',
    textAlign: 'left',
    color: '#333333',
  },
  input: {
    padding: '10px',
    marginBottom: '1rem',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #cccccc',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#4a3f8e', // Dark purple color for the button
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  footerText: {
    marginTop: '1rem',
    fontSize: '14px',
    color: '#666666',
  },
  link: {
    color: '#4a3f8e', // Matching link color
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    marginBottom: '1rem',
    fontSize: '14px',
  },
};


export {getServerSideProps};