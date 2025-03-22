import { getPosts } from "@/app/api/function/posts";
import { GetResponseType } from "@/types/fetch-type";
import { PostType } from "@/types/post-type";
import { useCallback, useEffect, useState } from "react";

export const useFetchPosts = (page?: number, limit?: number, search?: string, categoryId?: string) => {
    const [posts, setPosts] = useState<GetResponseType<PostType[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPosts(page, limit, search, categoryId);
            setPosts(res.data);
        } catch (err) {
            setError("Error fetching posts");
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }, [ page, limit, search, categoryId ]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, loading, error, reload: fetchPosts };
};