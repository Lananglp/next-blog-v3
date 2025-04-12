import api, { FetchingType } from "@/lib/axios";
import { GetResponseType } from "@/types/fetch-type";
import { UserProfileType, UserType } from "@/types/userType";
import { AxiosResponse } from "axios";

export const getUsers = async (id?: string, page?: number, limit?: number, search?: string): Promise<AxiosResponse<GetResponseType<UserType[]>>> => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    return await api.get<GetResponseType<UserType[]>>(`/api/users?${params.toString()}`, { withCredentials: true });
};

export const findUser = async (id?: string, username?: string): Promise<AxiosResponse<GetResponseType<UserType<UserProfileType>>>> => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);
    if (username) params.append("username", username);

    return await api.get<GetResponseType<UserType<UserProfileType>>>(`/api/users?${params.toString()}`, { withCredentials: true });
};

export const postUser = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>('/api/users/create', data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const patchUser = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.put<FetchingType>('/api/users/edit', data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const patchUserProfile = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.put<FetchingType>('/api/profile/edit', data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteUsers = async (ids: string[]): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>(`/api/users/delete`, {
        data: { ids },
        withCredentials: true,
    });
};

// Tipe data untuk request follow/unfollow
interface FollowData {
    followerId: string;
    followedId: string;
}

// Fungsi untuk cek status follow
export const checkFollowStatus = async (data: FollowData): Promise<AxiosResponse<{ isFollowing: boolean }>> => {
    const params = new URLSearchParams();
    if (data.followerId) params.append("followerId", data.followerId);
    if (data.followedId) params.append("followedId", data.followedId);

    return await api.get<{ isFollowing: boolean }>(`/api/check-follow-status?${params.toString()}`, { withCredentials: true });
};

// Fungsi untuk follow user
export const followUser = async (data: FollowData): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>("/api/follow", data, {
        withCredentials: true,
    });
};

// Fungsi untuk unfollow user
export const unfollowUser = async (data: FollowData): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>("/api/unfollow", {
        data, // Mengirim data dalam body request
        withCredentials: true,
    });
};