'use client'
import { formatTimeAgo, decodeCategory, formatDateTime } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import '@/app/text-editor-preview.scss';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoaderCircleIcon, PenLineIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FollowButton from './follow-button';
import { RootState } from '@/lib/redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/modal-login';
import { useFetchRelatedPosts } from '@/hooks/use-fetch-related-posts';
import PostComment from './comment/post-comment';
import PostLikeButton from './post-like-button';

type Props = {
    post: PostType;
};

function PostShow({ post }: Props) {

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }

    const { isLogin, user, isLoading } = useSelector((state: RootState) => state.session);
    const { data, loading } = useFetchRelatedPosts(post.slug);
    const router = useRouter();

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className='grid grid-cols-8 gap-6 mb-6'>
            <div className='col-span-8 lg:col-span-5'>
                <div className='max-w-full mx-auto prose dark:prose-invert prose-custom'>
                    <header>
                        {post.image && (
                            <figure className='mt-0'>
                                <Image priority src={`${post.image}?tr=f-webp`} alt="Featured image AI" width={592} height={333} className='aspect-video object-cover w-full h-full rounded-lg' />
                                {post.altText && <figcaption className='text-zinc-600 dark:text-zinc-400 text-xs mt-2'>{post.altText}</figcaption>}
                            </figure>
                        )}
                        <h1 className='font-bold'>{post.title}</h1>
                    </header>
                    <article className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(post.content) }} />
                </div>
                {(data?.relatedByCategory && data?.relatedByCategory.length > 0 || data?.relatedByAuthor && data?.relatedByAuthor.length > 0) && <Separator orientation='horizontal' className='mb-4' />}
                {data?.relatedByCategory && data?.relatedByCategory.length > 0 && (
                    <div className='mb-4'>
                        <p className='mb-4 font-medium text-black dark:text-white'>Continue reading related posts :</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {data?.relatedByCategory.map((item, index) => (
                                <div className='w-full flex flex-col items-center gap-4' key={index}>
                                    <Link href={decodeCategory(item.categories[0].name, item.slug)} className='block aspect-video w-full rounded-lg'>
                                        <Image src={`${item.image}?tr=f-webp`} alt={item.altText || "Featured Image"} width={320} height={180} className='w-full h-full aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                                    </Link>
                                    <div className='w-full space-y-2'>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 md:text-lg font-medium text-black dark:text-white'>{item.title}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-xs md:text-sm'>{item.description}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='text-xs'><span className='font-semibold text-black dark:text-white'>{item.author?.name}</span> &nbsp; | &nbsp; {formatTimeAgo(item.createdAt)}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data?.relatedByAuthor && data?.relatedByAuthor.length > 0 && (
                    <div className='mb-4'>
                        <p className='mb-4 font-medium text-black dark:text-white'>Other posts by author :</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {data?.relatedByAuthor.map((item, index) => (
                                <div className='w-full flex flex-col items-center gap-4' key={index}>
                                    <Link href={decodeCategory(item.categories[0].name, item.slug)} className='block aspect-video w-full rounded-lg'>
                                        <Image src={`${item.image}?tr=f-webp`} alt={item.altText || "Featured Image"} width={320} height={180} className='w-full h-full aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                                    </Link>
                                    <div className='w-full space-y-2'>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 md:text-lg font-medium text-black dark:text-white'>{item.title}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-xs md:text-sm'>{item.description}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='text-xs'><span className='font-semibold text-black dark:text-white'>{item.author?.name}</span> &nbsp; | &nbsp; {formatTimeAgo(item.createdAt)}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className='col-span-8 lg:col-span-3'>
                <div className='h-full flex flex-col space-y-6'>
                    <div className='space-y-6'>
                        <div className='py-4 border-b border-template flex justify-between items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <Avatar className='h-8 w-8'>
                                        <AvatarImage src={post.author.image || ''} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-medium text-black dark:text-white'>{post.author.name ? post.author.name : 'Anonymous'}</p>
                                    <p className='text-xs'>{post.author.followers.length} followers</p>
                                </div>
                            </div>
                            <div>
                                {!isLoading ? user.role === 'ADMIN' && post.authorId === user.id ? (
                                    <Button type='button' onClick={() => router.push(`/admin/posts/edit/${post.id}`)} variant={'editorBlockBar'} size={'sm'}><PenLineIcon />Edit this post</Button>
                                ) : isLogin ? (
                                    <FollowButton followerId={user.id} followedId={post.authorId} />
                                ) : (
                                    <LoginModal>
                                        <Button variant={'primary'} size={'sm'} ><PlusIcon />Follow</Button>
                                    </LoginModal>
                                ) : (
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'}><LoaderCircleIcon className='animate-spin' />Loading...</Button>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className='mb-2 text-xs'>Published on :</p>
                            <p className='text-lg font-medium text-black dark:text-white'>{formatDateTime(post.createdAt.toISOString())}</p>
                            <p className='text-sm'>{formatTimeAgo(post.createdAt.toISOString())}</p>
                        </div>
                        <div className='flex flex-wrap items-center gap-4'>
                            <PostLikeButton postId={post.id} userId={user.id} totalLikes={post._count.likes} isLikedInitial={post.likes.some(like => like.userId === user.id)} />
                            <p className='text-sm'>9999 Views</p>
                        </div>
                        <div className='space-y-6'>
                            <div>
                                <p className='text-sm mb-2'>Categories :</p>
                                {post.categories.length > 0 && (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {post.categories.map((item, index) => (
                                            <Link key={index} href={`/${item.name.split(' ').join('-').toLowerCase()}`} className='px-4 py-1 hover:bg-zinc-200 hover:dark:bg-zinc-900 hover:text-black hover:dark:text-white border border-template rounded text-sm'>{item.name}</Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className='text-sm mb-2'>Tags :</p>
                                {post.tags.length > 0 && (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {post.tags.map((tag, index) => (
                                            <div key={index} className='px-4 py-1 border border-template rounded text-sm'>#{tag.split(' ').join('')}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex-grow'>
                        <PostComment post={post} user={user} isLogin={isLogin} totalComments={post._count.comments} />
                    </div>
                    {data?.randomPosts && data?.randomPosts.length > 0 && (
                        <div>
                            <p className='font-medium text-black dark:text-white mb-4'>Related Posts :</p>
                            <div className='space-y-4'>
                                {data?.randomPosts.map((item, index) => (
                                    <div className='flex items-center gap-4' key={index}>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='block aspect-video w-64 md:w-80 rounded-lg'>
                                            <Image src={`${item.image}?tr=f-webp`} alt={item.altText || "Featured Image"} width={320} height={180} className='aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                                        </Link>
                                        <div className='w-full space-y-2'>
                                            <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-sm md:text-base font-medium text-black dark:text-white'>{item.title}</Link>
                                            <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-xs'>{item.description}</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostShow