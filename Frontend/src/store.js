import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { favoritesAPI, authAPI } from './api';

// --- Auth Slice ---
const authInitialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    }
  },
});

export const { logout, setAuth } = authSlice.actions;

// --- Favorites Slice ---
export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await favoritesAPI.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// --- Store ---
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
});