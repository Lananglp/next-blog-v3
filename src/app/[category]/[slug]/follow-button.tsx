'use client';
import { followUser, unfollowUser } from "@/app/api/function/users";
import { Button } from "@/components/ui/button";
import { useCheckFollowStatus } from "@/hooks/use-check-follow-status";
import { RootState } from "@/lib/redux";
import { CheckIcon, LoaderCircle, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
    followerId: string;
    followedId: string;
}

const FollowButton = ({ followerId, followedId }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [follow, setFollow] = useState(false);
    const { isFollowing, reload } = useCheckFollowStatus({ followerId, followedId });

    useEffect(() => {
        setFollow(isFollowing);
    }, [isFollowing]);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            const res = await followUser({ followerId, followedId });
            if (res.status === 200) {
                reload();
                setFollow(true);
            };
        } catch (error) {
            console.error("Follow failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setIsLoading(true);
        try {
            const res = await unfollowUser({ followerId, followedId });
            if (res.status === 200) {
                reload();
                setFollow(false);
            };
        } catch (error) {
            console.error("Unfollow failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={follow ? handleUnfollow : handleFollow}
            disabled={isLoading}
            variant={follow ? 'submit' : 'primary'}
            size={'sm'}
        >
            {!isLoading ? follow ? <CheckIcon /> : <PlusIcon /> : <LoaderCircle className="animate-spin" />}
            {!isLoading ? follow ? "Following" : "Follow" : "Loading..."}
        </Button>
    );
};

export default FollowButton;
