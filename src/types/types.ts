export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  contactPhone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: 'user' | 'admin' | null;
}


// events
export type Event = {
  eventId: number;
  title: string;
  description?: string;
  venueId: number;
  category?: string;
  date: string;
  time: string;
  ticketPrice: number;
  ticketsTotal: number;
  ticketsSold: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
};

// Booking
export type Booking = {
  bookingId?: number; // Optional for POST
  userId: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  bookingStatus?: string; // Optional — default is "Pending"
  createdAt?: string;
  updatedAt?: string;
};
