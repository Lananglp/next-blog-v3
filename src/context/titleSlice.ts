import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { title: string; } = {
    title: "...",
};

const titleSlice = createSlice({
    name: "titleSlice",
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
    },
});

export const { setTitle } = titleSlice.actions;
export default titleSlice.reducer;
