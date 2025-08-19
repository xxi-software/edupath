import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the User interface based on the backend response
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  specialization?: string;
  institution?: string;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  lastLogin: string | null;
  groups: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the AuthState interface
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setToken, setUser, setCredentials, logout } = authSlice.actions;

// Export selectors
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
