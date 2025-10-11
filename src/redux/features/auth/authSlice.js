// redux/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage
const user = localStorage.getItem('adminUser') && JSON.parse(localStorage.getItem('adminUser')) ;
const token = localStorage.getItem('authToken')  && localStorage.getItem('authToken');

const initialState = {
  user: user,
  token: token,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  registerState: null
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('/api/admin/auth', userData);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message ||
        error.message ||
        'Failed to login';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('/api/admin/auth', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message ||
        error.message ||
        'Failed to register';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminUser');
});

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.registerState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.registerState = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset, loginSuccess, registerSuccess } = authSlice.actions;
export default authSlice.reducer;