import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

export const fetchChatList = createAsyncThunk(
  'chatList/fetchChatList',
  async (userId, {rejectWithValue}) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${ENDPOINT.GET_CHAT_LIST}/${userId}`, {
        headers: {Authorization: 'Bearer ' + authToken},
        timeout: 10000,
      });

      return response.data.data.chats.docs;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Define the initial state
const initialState = {
  chatList: [],
  loading: false,
  error: null,
};

const chatListSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchChatList.pending, state => {
        state.loading = true;
        state.error = null;
        state.chatList = state.chatList;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.chatList = state.chatList;
      });
  },
});

export default chatListSlice.reducer;
