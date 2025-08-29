import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import createEventReducer from "./slices/createEventSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    createEvent: createEventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
