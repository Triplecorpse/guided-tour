// slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ROUTES } from "@/config";

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

// ✅ Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "authentication/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(ROUTES.authentication.check, {
        credentials: "include",
      });

      if (!res.ok) {
        return rejectWithValue("Network error");
      }

      const response: Record<string, any> = await res.json();

      console.log(response);

      if (response.data.isAuthenticated) {
        return response.data.user as User;
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
