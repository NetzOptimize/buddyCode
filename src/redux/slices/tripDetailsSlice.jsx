import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// Define the async thunk
export const fetchTripData = createAsyncThunk(
  'tripDetails/fetchTripData',
  async (tripId, {rejectWithValue}) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `${ENDPOINT.GET_TRIP_DETAILS}/${tripId}`,
        {
          headers: {
            Authorization: 'Bearer ' + authToken,
          },
          timeout: 10000,
        },
      );
      return response.data.data;
    } catch (error) {
      // Log error for debugging
      console.log('Get Single Trip error', error.response?.data);
      // Use rejectWithValue to handle errors in the slice
      return rejectWithValue(
        error.response?.data || 'Failed to fetch trip data.',
      );
    }
  },
);

// Define the initial state
const initialState = {
  tripInfo: null,
  loading: true,
  error: null,
};

// Create the slice
const tripDetailsSlice = createSlice({
  name: 'tripDetails',
  initialState,
  reducers: {
    resetTripData: state => {
      state.tripInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTripData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripData.fulfilled, (state, action) => {
        state.loading = false;
        state.tripInfo = action.payload;
      })
      .addCase(fetchTripData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch trip data.';
      });
  },
});

export const {resetTripData} = tripDetailsSlice.actions;
export default tripDetailsSlice.reducer;
