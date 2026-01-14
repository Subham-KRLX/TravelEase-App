import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import SignUpScreen from './pages/SignUpScreen';
import SearchResultsScreen from './pages/SearchResultsScreen';
import DashboardScreen from './pages/DashboardScreen';
import FlightDetailsScreen from './pages/FlightDetailsScreen';
import HotelDetailsScreen from './pages/HotelDetailsScreen';
import PackageDetailsScreen from './pages/PackageDetailsScreen';
import PaymentScreen from './pages/PaymentScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './config/stripe';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

function AppContent() {
  const location = useLocation();
  // Don't show header on login/signup pages if desired, but user said "don't change anything else", 
  // usually apps have headers except maybe login. LoginScreen design has its own header title, 
  // but a navigation header is good for "Back to Home". 
  // Let's keep Header on all pages for now as it handles Auth state.

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/search" element={<SearchResultsScreen />} />
        {/* Placeholder for other routes */}
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/flight-details/:id" element={<FlightDetailsScreen />} />
        <Route path="/hotel-details/:id" element={<HotelDetailsScreen />} />
        <Route path="/package-details/:id" element={<PackageDetailsScreen />} />
        <Route path="/payment" element={
          <Elements stripe={stripePromise}>
            <PaymentScreen />
          </Elements>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <GlobalStyle />
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
