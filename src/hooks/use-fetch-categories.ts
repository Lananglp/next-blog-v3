import { getCategories } from "@/app/api/function/categories";
import { CategoriesType } from "@/types/category-type";
import { GetResponseType } from "@/types/fetch-type";
import { useCallback, useEffect, useState } from "react";

export const useFetchCategories = (id?: string, page?: number, limit?: number, search?: string) => {
    const [categories, setCategories] = useState<GetResponseType<CategoriesType[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCategories(id, page, limit, search);
            setCategories(res.data);
        } catch (err) {
            setError("Error fetching categories");
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, reload: fetchCategories };
};