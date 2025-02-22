import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "@/context/sessionSlice";
import postPreviewReducer from "@/context/postPreviewSlice";
import titleReducer from "@/context/titleSlice";
import { useDispatch } from "react-redux";

export const redux = configureStore({
  reducer: {
    session: sessionReducer,
    postPreview: postPreviewReducer,
    pageTitle: titleReducer,
  },
});
  
export type RootState = ReturnType<typeof redux.getState>;
export type AppDispatch = typeof redux.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;