import api, { FetchingType } from "@/lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

type AuthResponseImagekit = {
    signature: string;
    expire: number;
    token: string;
}

export const getAuthFromImagekit = async (
    custom?: AxiosRequestConfig
): Promise<AxiosResponse<AuthResponseImagekit>> => {
    return await api.get<AuthResponseImagekit>('/api/auth/imagekit', {
        // withCredentials: true,
        ...custom,
    });
};