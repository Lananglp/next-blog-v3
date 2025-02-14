import { initialUser, UserType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostType = {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    status: string;
    categories: string[];
    tags: string[];
};

const initialPost: PostType = {
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: [],
    categories: [],
    status: 'draft',
};


const initialState: { post: PostType } = {
    post: initialPost,
};

const postPreviewSlice = createSlice({
    name: "postPreviewSlice",
    initialState,
    reducers: {
        setPostPreview: (state, action: PayloadAction<PostType>) => {
            state.post = action.payload;
        },
    },
});

export const { setPostPreview } = postPreviewSlice.actions;
export default postPreviewSlice.reducer;
