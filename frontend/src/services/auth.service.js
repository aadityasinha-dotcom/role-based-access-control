// src/services/auth.service.js
// This is a mock auth service using localStorage - in a real app, use proper API calls
import axios from 'axios';

// Base API URL - adjust as needed to match your backend server address
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/auth';

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, NEVER store plain text passwords
    role: 'admin'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

// LocalStorage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, {
      email,
      password
    });
    
    if (response.data.token) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      'Login failed. Please check your credentials.';
    
    throw new Error(errorMessage);
  }
};

export const signup = async (username, email, password, role = 'user') => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
      roles: [role] // Pass role as array to match backend expectation
    });
    return response.data;
  } catch (error) {
    // Extract meaningful error message from response if available
    const errorMessage = 
      error.response?.data?.message || 
      'Registration failed. Please try again.';
    
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/signout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove user from localStorage
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};
