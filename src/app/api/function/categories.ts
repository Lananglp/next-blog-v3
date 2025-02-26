import api, { FetchingType } from "@/lib/axios";
import { CategoriesType } from "@/types/category-type";
import { GetResponseType } from "@/types/fetch-type";
import { AxiosResponse } from "axios";

export const getCategories = async (id?: string, page?: number, limit?: number, search?: string): Promise<AxiosResponse<GetResponseType<CategoriesType[]>>> => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    return await api.get<GetResponseType<CategoriesType[]>>(`/api/categories?${params.toString()}`, { withCredentials: true });
};

export const showCategory = async (id?: string): Promise<AxiosResponse<CategoriesType>> => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);

    return await api.get<CategoriesType>(`/api/categories?${params.toString()}`, { withCredentials: true });
};

export const postCategory = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.post<FetchingType>(`/api/categories/create`, data, { withCredentials: true, });
};

export const patchCategory = async (data: FormData): Promise<AxiosResponse<FetchingType>> => {
    return await api.patch<FetchingType>(`/api/categories/edit`, data, { withCredentials: true });
};

export const deleteCategories = async (ids: string[]): Promise<AxiosResponse<FetchingType>> => {
    return await api.delete<FetchingType>(`/api/categories/delete`, {
        data: { ids },
        withCredentials: true,
    });
};