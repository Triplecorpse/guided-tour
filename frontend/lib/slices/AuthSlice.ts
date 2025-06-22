// slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
};

const initialState: AuthState = {
  user: null,
  status: "idle",
};

// ✅ Async thunk to check auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/authentication/check", {
        credentials: "include", // send cookies if needed
      });

      if (!res.ok) {
        return rejectWithValue("Network error");
      }

      const data = await res.json();

      if (data.isAuthenticated) {
        return data.user as User;
      } else {
        return rejectWithValue("Not authenticated");
      }
    } catch (err) {
      return rejectWithValue("Request failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
