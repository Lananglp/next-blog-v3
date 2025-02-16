import api, { FetchingType } from "@/lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export const getImage = async (
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<FetchingType>> => {
    return await api.get<FetchingType>('/api/images', {
        withCredentials: true,
        ...custom,
    });
};

export const postImage = async (
    image: File,
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<{ success: boolean; image: { id: string; url: string } }>> => {
    if (!image) throw new Error('No image provided');

    const formData = new FormData();
    formData.append('file', image);

    return await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        ...custom,
    });
};

export const deleteImage = async (
    imageId: string,
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return await api.delete(`/api/images/delete`, {
        data: { imageId }, // Kirim data dalam body request
        withCredentials: true,
        ...custom,
    });
};