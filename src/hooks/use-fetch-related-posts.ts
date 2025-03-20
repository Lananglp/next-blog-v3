import { getPosts, getRelatedPosts } from "@/app/api/function/posts";
import { GetResponseType } from "@/types/fetch-type";
import { PostType } from "@/types/post-type";
import { useCallback, useEffect, useState } from "react";

type RelatedType = {
    relatedByCategory: PostType[];
    relatedByAuthor: PostType[];
    randomPosts: PostType[];
}

export const useFetchRelatedPosts = (slug: string) => {
    const [data, setData] = useState<RelatedType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getRelatedPosts(slug);
            setData(res.data);
        } catch (err) {
            setError("Error fetching related posts");
            console.error("Error fetching related posts:", err);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return { data, loading, error, reload: fetchItems };
};