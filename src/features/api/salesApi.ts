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

// Dynamic base URL switch for local/dev
const getBaseUrl = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://event-ticketing-backend-b2b9.onrender.com/api";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
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
