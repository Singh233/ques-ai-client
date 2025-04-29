import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { env } from "~/env.mjs";
import { removeCookie } from "~/lib/hooks/useCookies";

const API_URL = env.NEXT_PUBLIC_API_URL;

// Define the initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create async thunk for fetching user profile on app mount
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        withCredentials: true,
      });

      return response.data.user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(error.message);
    }
  }
);

// Create async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      // Clear tokens from cookies
      removeCookie("accessToken");
      removeCookie("refreshToken");

      // Dispatch the local logout action to clean up the state
      dispatch(logout());
      return response.data;
    } catch (error) {
      // Clear tokens from cookies
      removeCookie("accessToken");
      removeCookie("refreshToken");
      // Even if the API call fails, we still want to log out locally
      dispatch(logout());

      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const { loginSuccess, loginFailure, logout, clearError, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
