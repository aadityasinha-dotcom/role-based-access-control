// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginService, logout as logoutService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      // Check if user has admin role
      setIsAdmin(user.roles && user.roles.includes('ROLE_ADMIN'));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await loginService(username, password);
      setCurrentUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.roles && userData.roles.includes('ROLE_ADMIN'));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await logoutService();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const value = {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
