'use client'
import { formatTimeAgo } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import React, { useEffect, useState } from 'react'
import '@/app/text-editor-preview.scss';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommentType } from '@/helper/schema/schema';
import { UserType } from '@/types/userType';
import { toggleLikeComment } from '@/app/api/function/comment';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { responseStatus } from '@/helper/system-config';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import RepliesSection from './replies-section';

const CommentSection = ({ post, user, comment, onReply }: { post: PostType, user: UserType, comment: CommentType, onReply: (commentId: string, userName: string) => void }) => {

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        // Ambil status like dari comment.likes saat komponen pertama kali dimuat
        if (comment.likes?.some((l) => l.userId === user.id)) {
            setIsLiked(true);
        }
    }, [comment.likes, user.id]);

    const handleSubmitLike = async (commentId: string, userId: string) => {
        if (isLoading) return; // Mencegah klik berulang saat request masih berjalan
        setIsLoading(true);

        try {
            const data = { commentId, userId }
            await toggleLikeComment(data);
            setIsLiked((prev) => !prev);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("AxiosError: ", error.response);
                if (error.response?.data.status) {
                    toast({
                        title: responseStatus.error,
                        description: `${error.response?.data.message.toString()}. (${error.response?.status.toString()})` || "an error occurred",
                    });
                }
            } else {
                console.log("Unknown error: ", error);
            }
        } finally {
            setIsLoading(false); // Pastikan loading state di-reset
        }
    };

    return (
        <div className='pb-2 border-b border-zinc-200 dark:border-zinc-900 space-y-2'>
            <div className="flex justify-between items-start gap-2">
                <div className='flex items-center gap-2'>
                    <Avatar className="h-8 w-8 border border-template">
                        <AvatarImage src={comment.author.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='line-clamp-1 text-xs'>{comment.createdAt && formatTimeAgo(comment.createdAt)}</p>
                        <h6 className="line-clamp-1 text-sm text-black dark:text-white font-medium">{comment.author.name} {comment.authorId === post.authorId && <span className='px-2 border border-template rounded text-sky-700 dark:text-sky-400 font-medium text-xs'>Creator</span>}</h6>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <Button type='button' onClick={() => handleSubmitLike(comment.id, user.id)} variant={'ghost'} size={'iconXs'}>
                        {isLiked ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
                    </Button>
                    <Button type='button' onClick={() => onReply(comment.id, comment.author.name)} variant={'outline'} size={'xs'}>Reply</Button>
                </div>
            </div>
            <div className='text-sm space-y-1'>
                <p>{comment.content}</p>
            </div>
            {/* <RepliesSection key={index} post={post} user={user} replies={replies} onReply={onReply} /> */}
            <RepliesSection post={post} user={user} onReply={onReply} commentId={comment.id} replyCount={comment.replies?.length || 0} />
        </div>
    );
}

export default CommentSection;