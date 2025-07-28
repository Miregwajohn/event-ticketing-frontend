import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Event } from '../../types/types'; 

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://event-ticketing-backend-b2b9.onrender.com/api',
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
    
    //  GET all events with optional filters
    getEvents: builder.query<Event[], { category?: string; date?: string; location?: string }>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.date) params.append('date', filters.date);
        if (filters?.location) params.append('address', filters.location);
        return `events?${params.toString()}`;
      },
      providesTags: ['Events'],
    }),

    //  GET single event by ID
    getEventById: builder.query<Event, number>({
      query: (id) => `events/${id}`,
      providesTags: ['Events'],
    }),

    //  GET single event by Slug (NEW)
    getEventBySlug: builder.query<Event, string>({
      query: (slug) => `events/slug/${slug}`,
      providesTags: ['Events'],
    }),

    //  GET Upcoming Events
    getUpcomingEvents: builder.query<Event[], void>({
      query: () => 'events?upcomingOnly=true',
      providesTags: ['Events'],
    }),

    //  CREATE Event
    createEvent: builder.mutation<any, Partial<Event>>({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: ['Events'],
    }),

    //  UPDATE Event
    updateEvent: builder.mutation<any, { event_id: number; payload: Partial<Event> }>({
      query: ({ event_id, payload }) => ({
        url: `events/${event_id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Events'],
    }),

    //  DELETE Event
    deleteEvent: builder.mutation<any, number>({
      query: (eventId) => ({
        url: `events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),

    //  Book an Event
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
  useGetEventBySlugQuery, 
  useGetUpcomingEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCreateBookingMutation,
} = eventsApi;
