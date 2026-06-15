import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios defaults
axios.defaults.baseURL = window.location.origin;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bind authorization tokens to header requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            setAuthToken(null);
          }
        } catch (err) {
          console.error('Session loading failed:', err.message);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setAuthToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    return res.data;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const verifyEmail = async (token) => {
    const res = await axios.post('/api/auth/verify-email', { token });
    if (res.data.success && res.data.token) {
      setAuthToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (token, password) => {
    const res = await axios.post('/api/auth/reset-password', { token, password });
    return res.data;
  };

  const checkoutPremium = async () => {
    const res = await axios.post('/api/subscriptions/checkout');
    if (res.data.success) {
      // Refresh current user instance
      setUser(prev => ({ ...prev, plan: 'premium' }));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      verifyEmail,
      forgotPassword,
      resetPassword,
      checkoutPremium,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
