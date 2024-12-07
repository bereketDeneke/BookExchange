import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '$ecret';

export const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login'; 
  };
  

  export async function getServerSideProps(context) {
    const { req, resolvedUrl } = context;
  
    // Parse cookies to retrieve the token
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.authorization;
  
    if (!token) {
       if( resolvedUrl === '/login' || resolvedUrl === '/register'){
        return {
            props: {}, // Pass empty props or additional data if needed
          };    
       }

      // Redirect to login page if no token is found
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  
    try {
      // Verify the JWT token
      jwt.verify(token, JWT_SECRET);
  
      // If the user is on the login or register page, redirect to home
      if (resolvedUrl === '/register' || resolvedUrl === '/login') {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
  
      // Allow access to the page if token is valid
      return {
        props: {}, // Pass empty props or additional data if needed
      };
    } catch (error) {
      // Redirect to login if token is invalid or expired
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  }