import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserMe } from "../../types/User";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetch(`${apiUrl}/api/users/me`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Unauthorized");
  return await response.json();
});

interface UserState {
  user: UserMe | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = "Unauthorized";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
