import { getComments } from "@/app/api/function/comment";
import { getReplies } from "@/app/api/function/replies";
import { CommentType } from "@/helper/schema/schema";
import { useCallback, useEffect, useState } from "react";

export const useFetchReplies = (commentId?: string) => {
    const [replies, setReplies] = useState<CommentType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        if (!commentId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getReplies(commentId);
            setReplies(res.data);
        } catch (err) {
            setError("Error fetching replies");
            console.error("Error fetching replies:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (commentId) {
            fetchItems();
        }
    }, [commentId]);

    return { replies, loading, error };
};
