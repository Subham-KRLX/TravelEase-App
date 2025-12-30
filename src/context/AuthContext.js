import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('travelease_user');
      const token = await AsyncStorage.getItem('auth_token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        // Optionally verify token validity with backend here
        // authService.getCurrentUser().then(res => { if(!res.success) logout(); });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login({ email, password });

      console.log('Login result:', result);

      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      const result = await authService.googleLogin();
      console.log('Google login result:', result);

      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Google login exception:', error);
      return { success: false, error: 'Google login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      const result = await authService.signup({ name, email, password });
      console.log('Signup result:', result);

      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        console.error('Signup failed with error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Signup exception:', error);
      return { success: false, error: 'Signup failed. Please check your internet connection or try again later.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    googleLogin,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
