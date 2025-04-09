'use client'
import { PostType } from '@/types/post-type';
import React, { useEffect, useRef, useState } from 'react'
import '@/app/text-editor-preview.scss';
import { Separator } from '@/components/ui/separator';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputComment from '@/components/input/input-comment';
import { CommentCreateFormType, CommentCreateSchema } from '@/helper/schema/schema';
import { UserType } from '@/types/userType';
import { postComment } from '@/app/api/function/comment';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { responseStatus } from '@/helper/system-config';
import { useFetchComments } from '@/hooks/use-fetch-comments';
import { Skeleton } from '@/components/ui/skeleton';
import CommentSection from './comment-section';

const PostComment = ({ post, user, isLogin, totalComments }: { post: PostType, user: UserType, isLogin: boolean, totalComments: number }) => {
    const [isloading, setIsLoading] = useState<boolean>(true);
    const [replyName, setReplyName] = useState<string>('');
    const formCommentRef = useRef<HTMLFormElement>(null);
    const inputCommentRef = useRef<HTMLTextAreaElement>(null);
    const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<CommentCreateFormType>({
        resolver: zodResolver(CommentCreateSchema),
        defaultValues: {
            content: '',
            slug: post.slug,
            authorId: user.id,
            parentId: null,
        },
    });
    const [textareaHeight, setTextareaHeight] = useState<number>(0);
    const { toast } = useToast();
    const [slugReady, setSlugReady] = useState<boolean>(false);
    const parentId = watch('parentId');

    useEffect(() => {
        if (post.slug) {
            setSlugReady(true);
        }
    }, [post.slug]);

    const { comments, loading, error, reload } = useFetchComments(slugReady ? post.slug : undefined);

    useEffect(() => {
        if (user.id) {
            setValue('authorId', user.id);
            setValue('slug', post.slug);
            setIsLoading(false);
        }
    }, [user.id, setValue, post.slug]);

    const handleReply = (commentId: string, userName: string) => {
        setValue('parentId', commentId);
        setReplyName(userName);
        if (formCommentRef.current) formCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        if (inputCommentRef.current) inputCommentRef.current.focus();
    }

    const handleUnreply = () => {
        setValue('parentId', null);
        setReplyName('');
    }

    const handleClickSubmit = () => {
        if (!isLogin) return;
        handleSubmit(onSubmit)();
    };

    // console.log(watch('parentId'));

    // console.log(errors);

    const onSubmit: SubmitHandler<CommentCreateFormType> = async (data) => {
        try {
            const res = await postComment(data);
            if (res.data?.status) {
                // toast({
                //     title: res.data.status,
                //     description: res.data.message,
                // });
                setValue('content', '');
                setValue('parentId', null);
                setReplyName('');
                reload();
            }
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
        };
    };

    return (
        <div className="sticky top-24 border border-template rounded-xl">
            <div className={`px-4 hover:bg-template py-4 rounded-t-xl cursor-pointer flex items-center justify-between hover-bg-template transition-colors duration-300`}>
                <h4 className={`font-medium text-base text-black dark:text-white`}><span>Discussion and Comments&nbsp;</span></h4>
                <p><MessageCircle className='inline h-4 w-4 mb-0.5 me-1' />{totalComments}</p>
            </div>
            <div className='relative'>
                <Separator />
                {/* <div style={{ height: `calc(65vh - ${textareaHeight}px)` }} className="overflow-y-auto space-y-4 p-4"> */}
                <div style={{ height: `calc(100svh - ${textareaHeight}px - 11rem)` }} className="overflow-y-auto space-y-4 p-4">
                    {!loading ?
                        comments && comments.length > 0 ?
                            comments.map((comment, index) => {
                                return (
                                    <CommentSection key={index} post={post} user={user} comment={comment} onReply={() => handleReply(comment.id, comment.author.name)} />
                                )
                            }
                            ) : post.commentStatus === 'OPEN' ? (
                                <p className='text-zinc-500 text-sm'>There are no comments for this post yet.</p>
                            ) : (
                                <p className='text-zinc-500 text-sm'>Comments are closed for this post.</p>
                            ) : (
                            <>
                                <div className="flex items-start gap-3">
                                    <Skeleton className='h-8 w-8 mt-1 rounded-full' />
                                    <div className='space-y-1'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-5 w-48' />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                                    <Skeleton className='h-8 w-8 mt-1 rounded-full' />
                                    <div className='space-y-1'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-5 w-48' />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                                    <Skeleton className='h-8 w-8 mt-1 rounded-full' />
                                    <div className='space-y-1'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-5 w-48' />
                                    </div>
                                </div>
                            </>
                        )}
                </div>
                {replyName !== '' && parentId !== null &&
                    <div className='absolute start-1' style={{ bottom: `${4 + textareaHeight}px` }}>
                        <div className='px-2 py-1 flex items-center gap-1 bg-zinc-200 dark:bg-zinc-900 border border-template text-black dark:text-white text-sm rounded'>
                            <p><span className='text-zinc-700 dark:text-zinc-400'>Reply to:</span> {replyName}</p>
                            <div>
                                <Button type='button' onClick={handleUnreply} variant={'ghost'} size={'iconXs'}><XIcon /></Button>
                            </div>
                        </div>
                    </div>
                }
                <form ref={formCommentRef} className="p-0 border-t border-template">
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <InputComment
                                ref={inputCommentRef}
                                control={control}
                                name="content"
                                value={field.value}
                                onSubmit={handleClickSubmit}
                                placeholder={isLogin ? replyName !== '' && parentId !== null ? `Reply to ${replyName}...` : `Comment as ${user.name}...` : 'Say something...'}
                                loading={loading}
                                disabledComment={post.commentStatus === 'CLOSED'}
                                onHeightChange={(value) => setTextareaHeight(value)}
                            />
                        )}
                    />
                </form>
            </div>
        </div>
    );
};

export default PostComment;