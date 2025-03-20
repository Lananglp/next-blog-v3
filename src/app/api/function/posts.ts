import api, { FetchingType } from "@/lib/axios";
import { GetResponseType } from "@/types/fetch-type";
import { PostType } from "@/types/post-type";
import { AxiosResponse } from "axios";

export const getPosts = async (page?: number, limit?: number, search?: string): Promise<AxiosResponse<GetResponseType<PostType[]>>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    return await api.get<GetResponseType<PostType[]>>(`/api/posts?${params.toString()}`, { withCredentials: true });
};

type RelatedType = {
    relatedByCategory: PostType[];
    relatedByAuthor: PostType[];
    randomPosts: PostType[];
}

export const getRelatedPosts = async (slug: string): Promise<AxiosResponse<RelatedType>> => {
    const params = new URLSearchParams();
    if (slug) params.append("slug", slug.toString());

    return await api.get<RelatedType>(`/api/posts/related?${params.toString()}`, { withCredentials: true });
};

export const postPost = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>(`/api/posts/create`, data, { withCredentials: true, });
};

export const postEdit = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.patch<FetchingType>(`/api/posts/edit`, data, { withCredentials: true, });
};

export const deletePosts = async (ids: string[]): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>(`/api/posts/delete`, {
        data: { ids }, // Kirim array ID sebagai payload
        withCredentials: true,
    });
};