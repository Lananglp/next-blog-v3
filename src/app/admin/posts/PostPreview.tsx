'use client'
import { formatTimeAgo, decodeCategory, formatDateTime, formatInitials } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import '@/app/text-editor-preview.scss';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoaderCircleIcon, PenLineIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import FollowButton from './follow-button';
import { RootState } from '@/lib/redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/modal-login';
import { useFetchRelatedPosts } from '@/hooks/use-fetch-related-posts';
import { PostFormValues } from '@/helper/schema/schema';
// import PostComment from './comment/post-comment';

type Props = {
    value: PostFormValues;
};

function PostPreview({ value }: Props) {

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }

    const { isLogin, user, isLoading } = useSelector((state: RootState) => state.session);
    const router = useRouter();

    return (
        <div className='grid grid-cols-8 gap-6 mb-6'>
            <div className='col-span-8 lg:col-span-5'>
                <div className='max-w-full mx-auto prose dark:prose-invert prose-custom'>
                    <header>
                        {value.image ? (
                            <figure className='mt-0'>
                                <Image priority src={`${value.image}?tr=f-webp`} alt="Featured image AI" width={592} height={333} className='aspect-video object-cover w-full h-full rounded-lg' />
                                {value.altText && <figcaption className='text-zinc-600 dark:text-zinc-400 text-xs mt-2'>{value.altText}</figcaption>}
                            </figure>
                        ) : (
                            <figure className='mt-0'>
                                <div className='bg-zinc-200/50 dark:bg-zinc-900/50 text-zinc-500 rounded-lg aspect-video object-cover w-full h-full flex justify-center items-center'>
                                    <div className='text-center p-4'>
                                        <div>Your post thumbnail will appear here.</div>
                                        <div className='text-sm'>Recommended: 16:9 (Landscape)</div>
                                    </div>
                                </div>
                                {value.altText && <figcaption className='text-zinc-600 dark:text-zinc-400 text-xs mt-2'>{value.altText}</figcaption>}
                            </figure>
                        )}
                        {value.title ? (
                            <h1 className='font-bold'>{value.title}</h1>
                        ) : (
                            <h1 className='font-bold'>Your post title here.</h1>
                        )}
                    </header>
                    {value.content ? (
                        <article className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(value.content) }} />
                    ) : (
                        <article className='tiptap-preview'>
                            <p>Your post content here.</p>
                        </article>
                    )}
                </div>
            </div>
            <div className='col-span-8 lg:col-span-3'>
                <div className='h-full flex flex-col space-y-6'>
                    <div className='space-y-6'>
                        <div className='py-4 border-b border-template flex justify-between items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback>{formatInitials(user.name || '')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-medium text-black dark:text-white'>{user.name ? user.name : 'Anonymous'}</p>
                                    <p className='text-xs'>{user.totalFollowers} followers</p>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-6'>
                            <div>
                                <p className='text-sm mb-2'>Categories:</p>
                                {value.categories.length > 0 ? (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {value.categories.map((item, index) => (
                                            <Link key={index} href={`/${item.split(' ').join('-').toLowerCase()}`} className='px-4 py-1 hover:bg-zinc-200 hover:dark:bg-zinc-900 hover:text-black hover:dark:text-white border border-template rounded text-sm'>{item}</Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Your post categories here.</p>
                                )}
                            </div>
                            <div>
                                <p className='text-sm mb-2'>Tags:</p>
                                {value.tags.length > 0 ? (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {value.tags.map((tag, index) => (
                                            <div key={index} className='px-4 py-1 border border-template rounded text-sm'>#{tag.split(' ').join('')}</div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Your post tags here.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className='flex-grow'>
                        <PostComment post={post} user={user} isLogin={isLogin} totalComments={value.comments} />
                    </div> */}
                    {/* {data?.randomPosts && data?.randomPosts.length > 0 && (
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
                                            <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-xs'>{item.excerpt}</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default PostPreview