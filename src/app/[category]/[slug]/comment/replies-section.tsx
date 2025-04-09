'use client'
import { formatTimeAgo } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import React, { useEffect, useState } from 'react'
import '@/app/text-editor-preview.scss';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRoundIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommentType } from '@/helper/schema/schema';
import { UserType } from '@/types/userType';
import { toggleLikeComment } from '@/app/api/function/comment';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { responseStatus } from '@/helper/system-config';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { PiArrowBendDownRightBold } from 'react-icons/pi';
import { useFetchReplies } from '@/hooks/use-fetch-replies';

type RepliesSectionProps = {
    post: PostType,
    user: UserType,
    replyCount: number,
    commentId: string,
    onReply: (commentId: string, userName: string) => void
}

const RepliesSection = ({ post, user, replyCount, commentId, onReply }: RepliesSectionProps) => {
    const [showReplies, setShowReplies] = useState<boolean>(false);

    return (
        <div>
            {!showReplies && replyCount > 0 && <Button type='button' onClick={() => setShowReplies(true)} variant={'ghost'} size={'xs'} className='w-full'>View {replyCount} more replies</Button>}
            {showReplies &&
                <RepliesLoop
                    post={post}
                    user={user}
                    commentId={commentId}
                    postAuthorId={post.authorId}
                    showReplies={showReplies}
                    onOpenChange={(value) => setShowReplies(value)}
                    onReply={(commentId, userName) => onReply(commentId, userName)}
                />
            }
        </div>
    );
}

export default RepliesSection;

type RepliesLoopProps = {
    post: PostType,
    user: UserType;
    commentId: string;
    postAuthorId: string;
    showReplies: boolean;
    onOpenChange: (value: boolean) => void;
    onReply: (commentId: string, userName: string) => void
}

const RepliesLoop = ({ post, commentId, postAuthorId, onOpenChange, showReplies, user, onReply }: RepliesLoopProps) => {

    const { replies, loading } = useFetchReplies(commentId);

    // console.log("rrr", replies);

    return (
        <div className='space-y-3 pt-3'>
            {!loading ? replies && replies?.map((replies, index) => {
                return (
                    <div className='flex gap-2' key={index}>
                        <div>
                            <PiArrowBendDownRightBold className='h-4 w-4 mt-2.5 text-zinc-300 dark:text-zinc-700' />
                        </div>
                        <div className='w-full space-y-2'>
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex items-start gap-2">
                                    <div className='flex items-center gap-2'>
                                        <Avatar className="h-8 w-8 border border-template">
                                            <AvatarImage src={replies.author.image} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className='line-clamp-1 text-xs'>{replies.createdAt && formatTimeAgo(replies.createdAt)}</p>
                                            <h6 className="line-clamp-1 text-sm text-black dark:text-white font-medium">{replies.author.name} {replies.authorId === postAuthorId && <span className='px-2 border border-template rounded text-sky-700 dark:text-sky-400 font-medium text-xs'>Creator</span>}</h6>
                                        </div>
                                    </div>
                                </div>
                                {post.commentStatus === 'OPEN' && (
                                    <ActionButton
                                        replies={replies}
                                        user={user}
                                        repliesAuthorName={replies.author.name}
                                        onReply={(commentId, userName) => onReply(commentId, userName)}
                                    />
                                )}
                            </div>
                            <div className='text-sm space-y-1'>
                                <p>{replies.replyToUser && <span className='px-1 bg-zinc-200 dark:bg-zinc-900 border border-template rounded text-black dark:text-white font-medium text-xs me-1'><UserRoundIcon className='inline h-3 w-3 mb-0.5 me-1' />{replies.replyToUser.name}</span>}{replies.content}</p>
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div className='h-7 text-xs text-center'>Please wait...</div>
            )}
            {!loading && showReplies && <Button type='button' onClick={() => onOpenChange(false)} variant={'ghost'} size={'xs'} className='w-full'>Hide reply</Button>}
        </div>
    );
}

type ActionButtonProps = {
    replies: CommentType;
    user: UserType;
    repliesAuthorName: string;
    onReply: (commentId: string, userName: string) => void
}

const ActionButton = ({ replies, user, repliesAuthorName, onReply }: ActionButtonProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        if (replies.likes?.some((l) => l.userId === user.id)) {
            setIsLiked(true);
        }
    }, [replies.likes, user.id]);

    const handleSubmitLike = async (commentId: string, userId: string) => {
        if (isLoading) return;
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
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center gap-1'>
            <Button type='button' onClick={() => handleSubmitLike(replies.id, user.id)} disabled={isLoading} variant={'ghost'} size={'iconXs'}>
                {isLiked ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
            </Button>
            <Button type='button' onClick={() => onReply(replies.id, repliesAuthorName)} variant={'outline'} size={'xs'}>Reply</Button>
        </div>
    )
}