import { PostType } from "./post-type";

export interface PaginationType {
    total: number;
    page: number;
    limit: number;
    totalPages: number; // Ganti totalPage -> totalPages
}

export interface GetResponseType<T = any> {
    // items: T | PostType[];
    items: T;
    pagination: PaginationType | null;
}