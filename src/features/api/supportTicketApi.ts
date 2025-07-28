import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supportApi = createApi({
  reducerPath: "supportApi",
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
  tagTypes: ["Support"],
  endpoints: (builder) => ({
    // 1 GET all support tickets
    getSupportTickets: builder.query<any[], void>({
      query: () => "support-tickets",
      providesTags: ["Support"],
    }),

    // 2 GET support ticket by ID
    getSupportTicketById: builder.query<any, number>({
      query: (id) => `support-tickets/${id}`,
      providesTags: ["Support"],
    }),

    // 6 GET support tickets for current logged-in user
getUserSupportTickets: builder.query<any[], void>({
  query: () => "support-tickets/me",
  providesTags: ["Support"],
}),


    // 3 CREATE support ticket
    createSupportTicket: builder.mutation<any, any>({
      query: (ticketData) => ({
        url: "support-tickets",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Support"],
    }),

    // 4 UPDATE support ticket
    updateSupportTicket: builder.mutation<any, { ticket_id: number; payload: any }>({
      query: ({ ticket_id, payload }) => ({
        url: `support-tickets/${ticket_id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Support"],
    }),

    // 5 DELETE support ticket
    deleteSupportTicket: builder.mutation<any, number>({
      query: (ticketId) => ({
        url: `support-tickets/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

//  Export hooks
export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
    useGetUserSupportTicketsQuery,
} = supportApi;
