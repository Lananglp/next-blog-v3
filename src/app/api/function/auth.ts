import api, { FetchingType } from "@/lib/axios";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const authCheck = async (): Promise<AxiosResponse<FetchingType>> => {
    return await api.get<FetchingType>(`/api/auth/check`);
};

export const authCheckRole = async (role: string): Promise<AxiosResponse<FetchingType>> => {
    return await api.get<FetchingType>(`/api/auth/check/role`, { params: { role } });
};

export const login = async ( data: FormData ): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>(`/api/login`, data, { withCredentials: true, });
};

export const register = async ( data: FormData ): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>('/api/register', data, { withCredentials: true, });
};

export const logout = async (
): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>('/api/logout', { withCredentials: true, });
}