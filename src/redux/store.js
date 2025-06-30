// app/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/authSlice';
import notificationsReducer from '@/redux/notificationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export default store;
