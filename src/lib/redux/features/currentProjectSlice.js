import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { env } from "~/env.mjs";
import { getCookie } from "~/lib/hooks/useCookies";

const API_URL = env.NEXT_PUBLIC_API_URL;

// Thunk for fetching a single project by name
export const fetchProjectByName = createAsyncThunk(
  "currentProject/fetchProjectByName",
  async (projectName, { rejectWithValue }) => {
    try {
      let token = getCookie("accessToken");

      const response = await axios.get(
        `${API_URL}/project/by-name/${projectName}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: {
    project: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.project = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single project cases
      .addCase(fetchProjectByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectByName.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchProjectByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Failed to fetch project" };
      });
  },
});

export const { clearCurrentProject } = currentProjectSlice.actions;
export default currentProjectSlice.reducer;
