import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/events/eventsSlice";
import { userApi } from "../features/api/userApi";
import { eventsApi } from "../features/api/eventsApi";
import { venueApi } from "../features/api/venueApi";
import { supportApi } from '../features/api/supportApi';
import { bookingsApi } from '../features/api/bookingApi';
import { paymentsApi } from '../features/api/paymentsApi';

// Auth slice persist config
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'userRole'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,   
    [eventsApi.reducerPath]: eventsApi.reducer,
      [venueApi.reducerPath]: venueApi.reducer,
      [supportApi.reducerPath]:supportApi.reducer,
      [bookingsApi.reducerPath]:bookingsApi.reducer,
      [paymentsApi.reducerPath]:paymentsApi.reducer,

    auth: persistedAuthReducer,             
    events: eventsReducer,                  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(userApi.middleware)
      .concat(eventsApi.middleware)
      .concat(venueApi.middleware)
      .concat(supportApi.middleware)
      .concat(bookingsApi.middleware)
      .concat(paymentsApi.middleware)
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
