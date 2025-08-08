import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCredentials, logout as logoutSlice } from './authSlice';

// Define the login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Define the register data interface
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// Define the API error interface
interface ApiError {
  response?: {
    data?: string;
  };
}

// Async action for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/login',
        credentials
      );
      
      const { token, user } = response.data;
      
      // Dispatch the setCredentials action to update the store
      dispatch(setCredentials({ token, user }));
      
      // Return the data for the fulfilled case
      return { token, user };
    } catch (error: unknown) {
      // Handle error and reject with value
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.data) {
        throw new Error(apiError.response.data);
      }
      throw new Error('An error occurred during login');
    }
  }
);

// Async action for registering a new user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { dispatch }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/createUser',
        userData
      );
      
      const { token, user } = response.data;
      
      // Dispatch the setCredentials action to update the store
      dispatch(setCredentials({ token, user }));
      
      // Return the data for the fulfilled case
      return { token, user };
    } catch (error: unknown) {
      // Handle error and reject with value
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.data) {
        throw new Error(apiError.response.data);
      }
      throw new Error('An error occurred during registration');
    }
  }
);

// Async action for logging out
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Dispatch the logout action from the slice
    dispatch(logoutSlice());
    
    // Return a success message
    return 'Logged out successfully';
  }
);