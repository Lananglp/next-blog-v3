import { CommentType } from "@/helper/schema/schema";
import api, { FetchingType } from "@/lib/axios";
import { GetResponseType } from "@/types/fetch-type";
import { AxiosResponse } from "axios";

// Ambil komentar berdasarkan slug post
export const getComments = async (slug: string): Promise<AxiosResponse<CommentType[]>> => {
    return await api.get<CommentType[]>(`/api/posts/comment?slug=${slug}`, { withCredentials: true });
};

// Tambah komentar atau balasan komentar
export const postComment = async (data: { content: string; slug: string; authorId: string; parentId: string | null }): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>(`/api/posts/comment/create`, data, { withCredentials: true });
};

// Edit komentar
export const editComment = async (data: { commentId: string; content: string }): Promise<AxiosResponse<FetchingType>> => {
    return await api.put<FetchingType>(`/api/posts/comment/edit`, data, { withCredentials: true });
};

// Hapus komentar
export const deleteComment = async (commentId: string): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>(`/api/posts/comment`, {
        data: { commentId },
        withCredentials: true,
    });
};

// Like atau Unlike komentar
export const toggleLikeComment = async (data: { commentId: string; userId: string }): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>(`/api/posts/comment/like`, data, { withCredentials: true });
};