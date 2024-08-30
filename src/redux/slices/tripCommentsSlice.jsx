import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

export const fetchTripComments = createAsyncThunk(
  'tripComments/fetchTripComments',
  async (tripId, {rejectWithValue}) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${ENDPOINT.GET_COMMENTS}/${tripId}`, {
        headers: {Authorization: 'Bearer ' + authToken},
        timeout: 10000,
      });

      return {
        comments: response.data.data.tripComment,
        tripId: tripId,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  comments: [],
  tripId: null,
  loading: false,
  error: null,
};

const tripCommentsSlice = createSlice({
  name: 'tripComments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTripComments.pending, state => {
        state.loading = true;
        state.error = null;
        state.tripId = null;
        state.comments = [];
      })
      .addCase(fetchTripComments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tripId = action.payload.tripId;
        state.comments = action.payload.comments;
      })
      .addCase(fetchTripComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tripId = action.meta.arg;
      });
  },
});

export default tripCommentsSlice.reducer;
