import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "@/context/sessionSlice";
import postPreviewReducer from "@/context/postPreviewSlice";

export const redux = configureStore({
  reducer: {
    session: sessionReducer,
    postPreview: postPreviewReducer,
  },
});
  
export type RootState = ReturnType<typeof redux.getState>;
export type AppDispatch = typeof redux.dispatch;