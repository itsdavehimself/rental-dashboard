import { createSlice } from "@reduxjs/toolkit";

interface CreateEventState {
  loading: boolean;
  error: string | null;
}

const initialState: CreateEventState = {
  loading: true,
  error: null,
};

const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {},
});

export const {} = createEventSlice.actions;
export default createEventSlice.reducer;
