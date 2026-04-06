import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_KEY = "auth_user";


const USE_MOCK = true;

const API = axios.create({
  baseURL: "https://ecommerce-backend-umber-seven.vercel.app",
  headers: {
    "Content-Type": "application/json"
  }
});

const loadUser = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      if (USE_MOCK) {
        return { message: "Mock signup success" };
      }

      const res = await API.post("/api/auth/seller/signup", {
        ...formData,
        joinAsSeller: true
      });

      return res.data;
    } catch (err) {
      console.error("Signup Error:", err.response || err.message);

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

      if (USE_MOCK) {
        return {
          token: "dev-token-123",
          user: {
            id: 1,
            name: "Dev User",
            email: credentials.email
          }
        };
      }

      console.log("Sending login:", credentials);

      const res = await API.post(
        "/api/auth/seller/login",
        credentials
      );

      console.log("Response:", res.data);

      return res.data;
    } catch (err) {
      console.error("Login Error:", err.response || err.message);

      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    loading: false,
    error: null,
    success: null
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
      clearUser();
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
        saveUser(userData);

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