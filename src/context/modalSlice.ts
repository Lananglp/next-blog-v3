import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    count: number;
}

const initialState: ModalState = {
    count: 0,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state) => {
            state.count += 1;
        },
        closeModal: (state) => {
            state.count = Math.max(0, state.count - 1);
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
