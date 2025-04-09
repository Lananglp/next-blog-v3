'use client';
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toggleLikePost } from "@/app/api/function/posts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

interface PostLikeProps {
    postId: string;
    userId: string;
    isLikedInitial: boolean;
    totalLikes: number;
}

const PostLikeButton: React.FC<PostLikeProps> = ({ postId, userId, isLikedInitial, totalLikes }) => {
    const [isLiked, setIsLiked] = useState<boolean | null>(null); // Mulai dengan null untuk menghindari flicker
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [mount, setMount] = useState(false);

    // Pastikan state baru terupdate setelah `isLikedInitial` berubah
    useEffect(() => {
        if (mount) {
            setIsLiked(isLikedInitial);
        }
    }, [isLikedInitial, mount]);

    useEffect(() => {
        setMount(true);
    }, []);

    const handleLike = async () => {
        if (isLoading || isLiked === null) return; // Hindari perubahan state saat masih memuat
        setIsLoading(true);

        try {
            await toggleLikePost({ postId, userId });
            setIsLiked((prev) => !prev);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("AxiosError: ", error.response);
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "An error occurred",
                });
            } else {
                console.log("Unknown error: ", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!mount || isLiked === null) return null; // Cegah rendering saat state masih kosong

    return (
        <Button type="button" onClick={handleLike} disabled={isLoading} variant={'editorBlockBar'}>
            {isLiked ? <FaHeart className='h-6 w-6 text-red-500' /> : <FaRegHeart className="h-6 w-6" />}
            {totalLikes} likes
        </Button>
    );
};

export default PostLikeButton;
