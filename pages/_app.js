// pages/_app.js
import '../styles/global.css';
import { UserProvider } from './context/UserContext'; // Import the provider


function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;

