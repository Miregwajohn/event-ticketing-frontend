import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Filters {
  category: string;
  date: string;
  location: string; 
}

interface EventsState {
  filters: Filters;
}

const initialState: EventsState = {
  filters: {
    category: '',
    date: '',
    location: '', 
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
  },
});

export const { setFilters, setLocationFilter } = eventsSlice.actions;
export default eventsSlice.reducer;
