import { checkFollowStatus } from "@/app/api/function/users";
import { useCallback, useEffect, useState } from "react";

interface FollowData {
    followerId: string;
    followedId: string;
}

export const useCheckFollowStatus = (data: FollowData) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await checkFollowStatus(data);
            setIsFollowing(res.data.isFollowing);
        } catch (err) {
            setError("Error checking following status");
            console.error("Error checking following status:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return { isFollowing, loading, error, reload: fetchItems };
};