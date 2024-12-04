/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  Id: string | null;
  FirstName: string;
  LastName: string;
}

interface UserState {
  token: string | null;
  user: User;
  mode: 'light' | 'dark';
}

const getDefaultMode = (): 'light' | 'dark' => {
  try {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }

    // Match system preference if no saved mode exists
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    // Default fallback if localStorage or window is not accessible
    return 'light';
  }
};


const initialState: UserState = {
  token: null,
  user: {
    Id: import.meta.env.VITE_WEB_USER_ID || null,
    FirstName: '',
    LastName: '',
  },
  mode: 'dark',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ AccessToken: string; User: User }>) => {
      state.token = action.payload.AccessToken;
      state.user = action.payload.User;
    },
    logOut: (state) => {
      state.user = {
        Id: import.meta.env.VITE_WEB_USER_ID || null,
        FirstName: '',
        LastName: '',
      };
      state.token = null;
      localStorage.removeItem('user');
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    changeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('mode', state.mode);
      } catch {
        console.warn('Unable to access localStorage to save mode.');
      }
    },
  },
});

export const { setCredentials, logOut, setToken, changeMode } =
  userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectMode = (state: { user?: { mode?: string } }) => state?.user?.mode || 'light';

export default userSlice.reducer;
