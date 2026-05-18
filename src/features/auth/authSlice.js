import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  loadAuth,
  saveAuth,
  clearAuth
} from "../../utils/authStorage";


// REAL BACKEND
/* const API = axios.create({
  baseURL: "http://65.0.29.192:5000",
  headers: {
    "Content-Type": "application/json"
  }
});
*/


// Attach token automatically

/* API.interceptors.request.use((config) => {
   const auth = loadAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
   }

   return config;
 });
*/

/* REAL SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/api/auth/signup",
        userData
      );

      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
); */


/* REAL LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/api/auth/login",
        credentials
      );

      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
*/



// DEMO SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (_, { rejectWithValue }) => {
    try {
      return {
        message: "Signup temporarily disabled"
      };
    } catch (err) {
      return rejectWithValue("Signup disabled");
    }
  }
);



// DEMO LOGIN

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (_, { rejectWithValue }) => {
    try {
      return {
        data: {
          id: "1",
          name: "Demo Seller",
          email: "demo@seller.com",
          role: "seller",
          token: "demo-token"
        }
      };
    } catch (err) {
      return rejectWithValue("Login disabled");
    }
  }
);



const storedAuth = loadAuth();

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: storedAuth?.user || null,
    token: storedAuth?.token || null,
    loading: false,
    error: null,
    success: null
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = null;

      clearAuth();
    },

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;

        state.success =
          action.payload.message || "Signup successful";
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const { token, ...user } = action.payload.data;

        state.user = user;
        state.token = token;

        saveAuth({ user, token });

        state.success = "Login successful";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  logout,
  clearMessages
} = authSlice.actions;

export default authSlice.reducer;