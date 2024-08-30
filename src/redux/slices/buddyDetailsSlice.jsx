// buddyDetailsSlice.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// Define the async thunk
export const fetchBuddyDetails = createAsyncThunk(
  'buddyDetails/fetchBuddyDetails',
  async (buddyId, {rejectWithValue}) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `${ENDPOINT.GET_BUDDY_DETAILS}/${buddyId}`,
        {
          headers: {Authorization: 'Bearer ' + authToken},
          timeout: 10000,
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Define the initial state
const initialState = {
  buddyDetails: null,
  loading: false,
  error: null,
};

// Create the slice
const buddyDetailsSlice = createSlice({
  name: 'buddyDetails',
  initialState,
  reducers: {
    resetBuddyDetails: state => {
      state.buddyDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBuddyDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuddyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.buddyDetails = action.payload;
      })
      .addCase(fetchBuddyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch buddy details.';
      });
  },
});

export const {resetBuddyDetails} = buddyDetailsSlice.actions;
export default buddyDetailsSlice.reducer;
