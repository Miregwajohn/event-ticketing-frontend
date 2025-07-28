import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { VenueBooking } from "../../types/types";

export const venueBookingApi = createApi({
  reducerPath: "venueBookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/venues", // Scoped to venue-related endpoints
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["VenueBookings"],
  endpoints: (builder) => ({
    //  GET all venue bookings — admin/debug
    getVenueBookings: builder.query<any[], void>({
      query: () => "bookings",
      providesTags: ["VenueBookings"],
    }),

    //  GET booking by ID
    getVenueBookingById: builder.query<any, number>({
      query: (id) => `bookings/${id}`,
      providesTags: ["VenueBookings"],
    }),

    //  GET venue bookings for current user
    getUserVenueBookings: builder.query<VenueBooking[], void>({
      query: () => "bookings/me",
      providesTags: ["VenueBookings"],
    }),

    //  CREATE venue booking
    createVenueBooking: builder.mutation<any, any>({
      query: (newBooking) => ({
        url: "bookings",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: ["VenueBookings"],
    }),

    //  UPDATE booking status (admin/moderation)
    updateVenueBookingStatus: builder.mutation<any, { bookingId: number; status: string }>({
      query: ({ bookingId, status }) => ({
        url: `bookings/${bookingId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["VenueBookings"],
    }),

    //  DELETE venue booking
    deleteVenueBooking: builder.mutation<any, number>({
      query: (bookingId) => ({
        url: `bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VenueBookings"],
    }),

    //  Check time-slot availability
    checkVenueAvailability: builder.query<any, {
      venueId: number;
      date: string;
      startTime: string;
      endTime: string;
    }>({
      query: ({ venueId, date, startTime, endTime }) => ({
        url: "availability",
        params: { venueId, date, startTime, endTime },
      }),
    }),
  }),
});

export const {
  useGetVenueBookingsQuery,
  useGetVenueBookingByIdQuery,
  useGetUserVenueBookingsQuery,
  useCreateVenueBookingMutation,
  useUpdateVenueBookingStatusMutation,
  useDeleteVenueBookingMutation,
  useCheckVenueAvailabilityQuery,
} = venueBookingApi;
