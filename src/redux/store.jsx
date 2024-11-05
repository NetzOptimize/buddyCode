import {configureStore} from '@reduxjs/toolkit';
import tripCommentsReducer from './slices/tripCommentsSlice';
import buddyDetailsReducer from './slices/buddyDetailsSlice';
import chatListReducer from './slices/chatListSlice';
import blockedUsersReducer from './slices/blockedUsersSlice';
import tripDetailsReducer from './slices/tripDetailsSlice';

const store = configureStore({
  reducer: {
    tripComments: tripCommentsReducer,
    buddyDetails: buddyDetailsReducer,
    chatList: chatListReducer,
    blockedUsers: blockedUsersReducer,
    tripDetails: tripDetailsReducer,
  },
});

export default store;
