import api, { FetchingType } from "@/lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export const login = async (
    data: FormData,
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>('/api/login',
        data,
        {
            withCredentials: true,
            ...custom,
        }
    );
};

export const register = async (
    data: FormData,
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>('/api/register',
        data,
        {
            withCredentials: true,
            ...custom,
        }
    );
};

export const logout = async (
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>('/api/logout', {
        withCredentials: true,
        ...custom
    });
}