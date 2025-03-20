import { initialUser, UserType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { user: UserType; isLogin: boolean, isLoading: boolean } = {
    user: initialUser,
    isLogin: false,
    isLoading: true,
};

const sessionSlice = createSlice({
    name: "sessionSlice",
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<UserType>) => {
            state.user.id = action.payload.id;
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
            state.user.image = action.payload.image;
            state.user.role = action.payload.role;
            state.user.createdAt = action.payload.createdAt;
            state.user.updatedAt = action.payload.updatedAt;
            // Periksa apakah account ada
            // if (action.payload.account) {
            //     state.user.account = {
            //         id: action.payload.account.id,
            //         userId: action.payload.account.userId,
            //         phone: action.payload.account.phone,
            //         address: action.payload.account.address,
            //         placeOfBirth: action.payload.account.placeOfBirth,
            //         dateOfBirth: action.payload.account.dateOfBirth,
            //         picture: action.payload.account.picture,
            //         createdAt: action.payload.account.createdAt,
            //         updatedAt: action.payload.account.updatedAt,
            //     };
            // }
            state.isLogin = true;
            state.isLoading = false;
        },

        setSessionLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        handleLogout: (state) => {
            state.user = initialUser;
            state.isLogin = false;
        },
    },
});

export const { setSessionLoading, setSession, handleLogout } = sessionSlice.actions;
export default sessionSlice.reducer;
