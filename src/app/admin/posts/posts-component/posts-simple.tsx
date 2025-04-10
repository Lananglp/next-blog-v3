import { Checkbox } from '@/components/ui/checkbox'
import { SelectedType } from '@/types/all-type';
import { PostType } from '@/types/post-type';
import { HeartIcon, Loader2, MessageCircleMoreIcon, MoveRightIcon, Settings2, UserRoundIcon, XIcon } from 'lucide-react';
import React from 'react'
import PostsThumbnail from './posts-thumbnail';
import { CategoriesType } from '@/types/category-type';
import { decodeCategory, formatDateTime } from '@/helper/helper';
import PostsLink from './posts-link';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    selectedPosts: SelectedType;
    items: PostType[];
    toggleAllSelection: (items: SelectedType) => void;
    loading: boolean;
    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
    toggleSelection: (id: string, title: string) => void;
    page: number;
    limit: number;
    isSelected: boolean;
    isSelectedChange: (value: boolean) => void;
};

function PostsSimple({
    selectedPosts,
    items,
    toggleAllSelection,
    loading,
    hoveredId,
    setHoveredId,
    toggleSelection,
    page,
    limit,
    isSelected,
    isSelectedChange,
}: Props) {
    return (
        <div>
            <div className='space-y-4'>
                {isSelected ? (
                    <div className='flex items-center gap-2'>
                        <Checkbox
                            checked={selectedPosts.length === items.length && items.length > 0}
                            onClick={() => toggleAllSelection(items)}
                            variant={'primary'}
                        />
                        <p className='text-sm'>Select All</p>
                        <Button type='button' onClick={() => isSelectedChange(false)} variant={'destructive'} size={'iconXs'}><XIcon /></Button>
                    </div>
                ) : (
                    <Button type='button' onClick={() => isSelectedChange(true)} variant={'editorBlockBar'} size={'sm'}><Settings2 />Actions</Button>
                )}
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
                    {!loading ?
                        items.length > 0 ?
                            items.map((post, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${hoveredId === post.id && selectedPosts.some((item) => item.id === post.id) ? 'bg-zinc-200/75 dark:bg-zinc-900/75' : 'hover:bg-zinc-200/75 dark:hover:bg-zinc-900/75'} px-3 py-3 border border-template rounded-lg space-y-3`}
                                        onMouseEnter={() => setHoveredId(post.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        {isSelected && (
                                            <div className='flex items-center gap-2'>
                                                <Checkbox
                                                    checked={selectedPosts.map((item) => item.id).includes(post.id)}
                                                    onClick={() => toggleSelection(post.id, post.title)}
                                                    variant={'primary'}
                                                />
                                                <p className='text-sm'>Select</p>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-3'>
                                            {post?.image && (
                                                <div className='w-64'>
                                                    <PostsThumbnail key={post?.id} url={post?.image} />
                                                </div>
                                            )}
                                            <div className='w-full space-y-2'>
                                                <div className='line-clamp-2 text-black dark:text-white text-sm'>
                                                    {post?.title}
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='inline-block'>
                                                        <div className='h-7 flex justify-center items-center border border-template rounded px-2'>
                                                            <p className={`
                                                                text-xs capitalize
                                                                ${post?.status === 'PUBLISH'
                                                                    ? 'text-green-300'
                                                                    : post?.status === 'PRIVATE'
                                                                        ? 'text-red-300'
                                                                        : 'text-black dark:text-white'}
                                                            `}
                                                            >{post?.status.toLowerCase()}</p>
                                                        </div>
                                                    </div>
                                                    <div className='inline-block'>
                                                        <Link href={decodeCategory(post.categories[0].name, post.slug)} className='hover:text-black hover:dark:text-white h-7 flex justify-center items-center text-xs gap-2'>View<MoveRightIcon className='inline h-4 w-4' /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between items-center gap-3'>
                                            <div className='flex items-center gap-3'>
                                                <Button type='button' variant={'transparent'} className='p-0 h-5'><MessageCircleMoreIcon />{post?._count?.comments || 0}</Button>
                                                <Button type='button' variant={'transparent'} className='p-0 h-5'><HeartIcon />{post?._count?.likes || 0}</Button>
                                            </div>
                                            <div className='inline-block'>
                                                <div className='flex items-center gap-1'>
                                                    <UserRoundIcon className='inline h-4 w-4' />
                                                    <p className='max-w-28 truncate text-xs text-nowrap'>{post?.author?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className='col-span-3'>
                                    <div className='p-4 border-b border-template text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                        You don&apos;t have any posts yet.
                                    </div>
                                </div>
                            ) : (
                                <div className={`px-3 py-3 border border-template rounded-lg flex items-center gap-3`}>
                                <Skeleton className='aspect-video w-64' />
                                <div className='ps-1 w-full space-y-2'>
                                    <Skeleton className='h-7 w-32' />
                                    <div className='flex items-center gap-2'>
                                        <Skeleton className='h-7 w-16' />
                                        <Skeleton className='h-7 w-16' />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default PostsSimple