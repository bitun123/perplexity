import { configureStore } from "@reduxjs/toolkit";

// Import the auth and chat reducers
import authReducer from "../features/auth/states/authSlice";
import chatReducer from "../features/chat/chat.slice";


// Configure the Redux store with the auth and chat reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
