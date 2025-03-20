import { getComments } from "@/app/api/function/comment";
import { CommentType } from "@/helper/schema/schema";
import { GetResponseType } from "@/types/fetch-type";
import { useCallback, useEffect, useState } from "react";

export const useFetchComments = (slug?: string) => {
    const [comments, setComments] = useState<CommentType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Set awal false biar tidak loading terus
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        if (!slug) return; // Jangan fetch kalau slug masih undefined
        setLoading(true);
        setError(null);
        try {
            const res = await getComments(slug);
            setComments(res.data);
        } catch (err) {
            setError("Error fetching comments");
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchComments();
        }
    }, [slug, fetchComments]); // Fetch hanya dijalankan saat slug berubah & tersedia

    return { comments, loading, error, reload: fetchComments };
};
