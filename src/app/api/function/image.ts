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
