import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer, // Asegúrate de que este reducer esté disponible
  },
  devTools: process.env.NODE_ENV !== 'production',
});


export default store;
