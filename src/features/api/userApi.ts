import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
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

    // Fetch single user
    getUserById: builder.query({
      query: (user_id: number) => `users/${user_id}`,
      providesTags: ['user'],
    }),

    // Fetch all users (admin only)
    getAllUsersProfiles: builder.query({
      query: () => 'users',
      providesTags: ['users'],
    }),

    // Get specific user profile (self or admin)
    getUserProfile: builder.query({
      query: (userId: number) => `users/${userId}`,
      providesTags: ['user'],
    }),

    // Update user
    updateUserProfile: builder.mutation({
      query: ({ user_id, ...patch }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['user', 'users'],
    }),

    // Update profile image (optional)
    updateUserProfileImage: builder.mutation({
      query: ({ user_id, profile_picture }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: { profile_picture },
      }),
      invalidatesTags: ['user', 'users'],
    }),

    // Delete user
    deleteUserProfile: builder.mutation({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersProfilesQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserProfileMutation,
} = userApi;
