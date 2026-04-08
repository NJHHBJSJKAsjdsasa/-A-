import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import communityReducer from './slices/communitySlice';
import learningReducer from './slices/learningSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    learning: learningReducer,
    message: messageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
