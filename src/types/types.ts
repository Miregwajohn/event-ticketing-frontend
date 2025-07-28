// Users
export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  contactPhone?: string;
  address?: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
    profileUrl?: string;
}

export type UpdateUserPayload = {
  user_id: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  contactPhone?: string;
  address?: string;
  profileUrl?: string; 
    role?: "user" | "admin";
};

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: "user" | "admin" | null;
}

//  Event

export interface Event {
  eventId: number;
  title: string;
  description?: string;
  venueId: number;
  venue?: {
    address?: string;
    name?: string;
  };
  category?: string;
  date: string;
  time: string;
  ticketPrice: number;
  ticketsTotal: number;
  ticketsSold: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
    slug: string;
}

//  Bookings

export interface Booking {
  bookingId?: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  bookingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserBooking {
  bookingId: number;
  quantity: number;
  totalAmount: number;
  bookingStatus: string;
  createdAt: string;
  eventTitle: string;
  eventDate: string;
  paymentMethod: string;
  paymentStatus: string;
}


// Venues


export interface Venue {
  venueId: number;
  name: string;
  address: string;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}

// Venue Bookings


export interface VenueBooking {
  venueBookingId: number;
  userId: number;
  venueId: number;
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Pending" | "Confirmed" | "Rejected";
  createdAt: string;
  updatedAt?: string;
  venue?: Venue;
}

export interface VenueBookingPayload {
  venueId: number;
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
}
