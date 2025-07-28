import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../../types/types';
import type { UpdateUserPayload } from '../../types/types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://event-ticketing-backend-b2b9.onrender.com/api',
    prepareHeaders: (headers, api) => {
      const state = api.getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    // Auth: Register
    registerUser: builder.mutation({
      query: (userRegisterPayload) => ({
        url: 'auth/register',
        method: 'POST',
        body: userRegisterPayload,
      }),
    }),

    // Auth: Login
    loginUser: builder.mutation({
      query: (userLoginCredentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: userLoginCredentials,
      }),
    }),

    // NEW: Fetch the currently authenticated user
    getCurrentUser: builder.query<User, void>({
      query: () => 'users/me',
      providesTags: ['user'],
    }),

    // Fetch single user by ID (admin or self)
    getUserById: builder.query<User, number>({
      query: (userId) => `users/${userId}`,
      providesTags: ['user'],
    }),

    //Fetch user infor
    getUserProfile: builder.query<User, number>({
  query: (userId) => `users/${userId}`,
  providesTags: ['user'],
}),


    // Fetch all users (admin only)
    getAllUsersProfiles: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['users'],
    }),

 // Update user profile
 
updateUserProfile: builder.mutation<User, UpdateUserPayload>({
  query: ({ user_id, ...patch }) => ({
    url: `users/${user_id}`,
    method: 'PUT',
    body: patch,
  }),
  invalidatesTags: ['user', 'users'], // if you're using cache tags
}),


    // Update profile image (optional)
    updateUserProfileImage: builder.mutation<{ user: User }, { user_id: number; profile_picture: string }>({
      query: ({ user_id, profile_picture }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: { profile_picture },
      }),
      invalidatesTags: ['user', 'users'],
    }),

    // Delete user profile
    deleteUserProfile: builder.mutation<void, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
   useGetUserProfileQuery,
  useGetAllUsersProfilesQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserProfileMutation,
} = userApi;
