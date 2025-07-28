import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://event-ticketing-backend-b2b9.onrender.com/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    //  GET all payments
    getPayments: builder.query<any[], void>({
      query: () => "payments",
      providesTags: ["Payments"],
    }),

    //  GET payment by ID
    getPaymentById: builder.query<any, number>({
      query: (id) => `payments/${id}`,
      providesTags: ["Payments"],
    }),

    // GET payments for logged-in user
    getUserPayments: builder.query<any[], void>({
      query: () => "payments/me",
      providesTags: ["Payments"],
    }),

    //  CREATE a new payment (manual fallback mode)
    createPayment: builder.mutation<any, any>({
      query: (newPayment) => ({
        url: "payments",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payments"],
    }),

    // UPDATE payment status/details
    updatePayment: builder.mutation<any, { payment_id: number; payload: any }>({
      query: ({ payment_id, payload }) => ({
        url: `payments/${payment_id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Payments"],
    }),

    // DELETE a payment
    deletePayment: builder.mutation<any, number>({
      query: (paymentId) => ({
        url: `payments/${paymentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),

    //  MPESA STK Push Trigger
    initiateStkPush: builder.mutation<
      any,
      { phone: string; bookingId: number; amount: number }
    >({
      query: ({ phone, bookingId, amount }) => ({
        url: "mpesa/stkpush",
        method: "POST",
        body: { phone, bookingId, amount },
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetUserPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useInitiateStkPushMutation, 
} = paymentsApi;
