import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { env } from "~/env.mjs";
import { setCookie, getCookie, removeCookie } from "~/lib/hooks/useCookies";

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
  async (_, { rejectWithValue }) => {
    try {
      // Get the cookie on the client side
      let token = "";
      if (typeof window !== "undefined") {
        token = getCookie("accessToken");
      }

      const response = await fetch(`${API_URL}/user/me`, {
        method: "GET",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      // parse the headers to get new tokens if available
      if (response.headers.has("Access-Token")) {
        const newAccessToken = response.headers.get("Access-Token");
        const newRefreshToken = response.headers.get("Refresh-Token");

        setCookie("accessToken", newAccessToken);
        setCookie("refreshToken", newRefreshToken);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Dispatch the local logout action to clean up the state
      dispatch(logout());
      return await response.json();
    } catch (error) {
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
      // Clear tokens from cookies
      if (typeof window !== "undefined") {
        removeCookie("accessToken");
        removeCookie("refreshToken");
      }
    },
    clearError: (state) => {
      state.error = null;
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

export const { loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions;
export default authSlice.reducer;
