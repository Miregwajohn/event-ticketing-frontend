import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const venueApi = createApi({
  reducerPath: "venueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Venues"],
  endpoints: (builder) => ({
    //  GET all venues
    getVenues: builder.query<any[], void>({
      query: () => "venues",
      providesTags: ["Venues"],
    }),

    //  GET venue by ID
    getVenueById: builder.query<any, number>({
      query: (id) => `venues/${id}`,
      providesTags: ["Venues"],
    }),

    // CREATE venue
    createVenue: builder.mutation<any, any>({
      query: (newVenue) => ({
        url: "venues",
        method: "POST",
        body: newVenue,
      }),
      invalidatesTags: ["Venues"],
    }),

    //  UPDATE venue
    updateVenue: builder.mutation<any, { venue_id: number; payload: any }>({
      query: ({ venue_id, payload }) => ({
        url: `venues/${venue_id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Venues"],
    }),

    //  DELETE venue
    deleteVenue: builder.mutation<any, number>({
      query: (venueId) => ({
        url: `venues/${venueId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Venues"],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venueApi;
