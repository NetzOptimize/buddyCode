// blockedUserSlice.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// Thunk to fetch blocked users
export const fetchBlockedUsers = createAsyncThunk(
  'blockedUsers/fetchBlockedUsers',
  async (_, {rejectWithValue}) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${ENDPOINT.GET_BLOCKED_USERS}`, {
        headers: {Authorization: 'Bearer ' + authToken},
        timeout: 10000,
      });

      console.log('hit');

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'An error occurred',
      );
    }
  },
);

// Define the initial state
const initialState = {
  blockedUsers: [],
  loading: false,
  error: null,
};

// Create the slice
const blockedUsersSlice = createSlice({
  name: 'blockedUsers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBlockedUsers.pending, state => {
        state.loading = true;
        state.error = null;
        state.blockedUsers = [];
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blockedUsers = action.payload;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch blocked users';
        state.blockedUsers = [];
      });
  },
});

export default blockedUsersSlice.reducer;
