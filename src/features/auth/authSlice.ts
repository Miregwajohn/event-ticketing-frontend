import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types/types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        userRole: "user" | "admin";
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
