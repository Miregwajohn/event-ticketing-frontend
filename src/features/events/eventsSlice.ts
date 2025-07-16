import { createSlice } from '@reduxjs/toolkit';            
import type { PayloadAction } from '@reduxjs/toolkit';      

interface Filters {
  category: string;  // Category selected by the user (e.g., Music, Art)
  date: string;      // Date selected by the user for filtering events
}

interface EventsState {
  filters: Filters;  // The filters object to store user-selected filter values
}

const initialState: EventsState = {
  filters: {
    category: '',  // Initially no category filter
    date: '',      // Initially no date filter
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Action to update filters
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;  // Set the new filters in Redux state
    },
  },
});

// Export the action to set filters
export const { setFilters } = eventsSlice.actions;

export default eventsSlice.reducer;
