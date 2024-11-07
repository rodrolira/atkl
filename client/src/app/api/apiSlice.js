import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { setCredentials, logOut } from '../../features/user/userSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  return await baseQuery(args, api, extraOptions);
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default apiSlice;
