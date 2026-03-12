import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_KEY = "auth_user";
const API = axios.create({
  baseURL: "http://65.0.29.192:5000/api/auth",
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

const saveUser = user => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(AUTH_KEY);
};


export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
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
      const res = await API.post("/login", credentials);
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
    user: loadUser(),
    loading: false,
    error: null,
    success: null
  },

  reducers: {
    logout: state => {
      state.user = null;
      state.error = null;
      state.success = null;
      clearUser();
    },

    clearMessages: state => {
      state.error = null;
      state.success = null;
    }
  },

  extraReducers: builder => {
    builder

      
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(signupUser.fulfilled, state => {
        state.loading = false;
        state.success = "Signup successful";
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, state => {
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