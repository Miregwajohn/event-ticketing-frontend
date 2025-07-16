import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Events', 'Bookings'],
  endpoints: (builder) => ({
    // 🔍 GET events with filters
    getEvents: builder.query<any[], { category?: string; date?: string }>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.date) params.append('date', filters.date);
        return `events?${params.toString()}`;
      },
      providesTags: ['Events'],
    }),

    // 🔍 GET event by ID
    getEventById: builder.query<any, number>({
      query: (id) => `events/${id}`,
      providesTags: ['Events'],
    }),

    // 🆕 CREATE event
    createEvent: builder.mutation<any, any>({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: ['Events'],
    }),

    // 🛠️ UPDATE event
    updateEvent: builder.mutation<any, { event_id: number; payload: any }>({
      query: ({ event_id, payload }) => ({
        url: `events/${event_id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Events'],
    }),

    // ❌ DELETE event
    deleteEvent: builder.mutation<any, number>({
      query: (eventId) => ({
        url: `events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),

    // ✅ Book an event (user-facing)
    createBooking: builder.mutation<any, any>({
      query: (bookingData) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Events', 'Bookings'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCreateBookingMutation,
} = eventsApi;
