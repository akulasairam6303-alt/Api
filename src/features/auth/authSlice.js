import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadAuth, saveAuth, clearAuth } from "../utils/authStorage";

const API = axios.create({
  baseURL: "https://ecommerce-backend-umber-seven.vercel.app",
  headers: {
    "Content-Type": "application/json"
  }
});



export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/seller/signup", {
        ...formData,
        joinAsSeller: true
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/api/auth/seller/login",
        credentials
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadAuth(),   
    loading: false,
    error: null,
    success: null
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
      clearAuth();   // 
    },

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.success = "Signup successful";
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const userData = {
          token: action.payload.token || null,
          user: action.payload.user || action.payload
        };

        state.user = userData;

        saveAuth(userData);  

        state.success = "Login successful";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;