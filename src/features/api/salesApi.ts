import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface TopEvent {
  eventId: number;
  title: string;
  totalTicketsSold: number;
  totalRevenue: number;
}

interface SalesReport {
  totalRevenue: number;
  totalBookings: number;
  topEvents: TopEvent[];
}

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/sales",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSalesReport: builder.query<SalesReport, void>({
      query: () => "/report",
    }),
  }),
});

export const { useGetSalesReportQuery } = salesApi;
