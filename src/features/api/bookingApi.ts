import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {  UserBooking } from "../../types/types";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://event-ticketing-backend-b2b9.onrender.com/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    //  GET all bookings 
    getBookings: builder.query<any[], void>({
      query: () => "bookings",
      providesTags: ["Bookings"],
    }),

    //  GET booking by ID
    getBookingById: builder.query<any, number>({
      query: (id) => `bookings/${id}`,
      providesTags: ["Bookings"],
    }),

    // GET bookings for the logged-in user (MyBookings)
getUserBookings: builder.query<UserBooking[], void>({
  query: () => "bookings/me",
  providesTags: ["Bookings"],
}),



    //  CREATE booking
    createBooking: builder.mutation<any, any>({
      query: (newBooking) => ({
        url: "bookings",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: ["Bookings"],
    }),

    //  UPDATE booking
    updateBooking: builder.mutation<any, { booking_id: number; payload: any }>({
      query: ({ booking_id, payload }) => ({
        url: `bookings/${booking_id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Bookings"],
    }),

    //  DELETE booking
    deleteBooking: builder.mutation<any, number>({
      query: (bookingId) => ({
        url: `bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
    useGetUserBookingsQuery,
  useDeleteBookingMutation,
} = bookingsApi;
