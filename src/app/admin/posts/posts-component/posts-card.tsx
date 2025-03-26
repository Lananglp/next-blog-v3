import { Checkbox } from '@/components/ui/checkbox'
import { SelectedType } from '@/types/all-type';
import { PostType } from '@/types/post-type';
import { Loader2, MoveRightIcon, Settings2, UserRoundIcon, XIcon } from 'lucide-react';
import React from 'react'
import PostsThumbnail from './posts-thumbnail';
import { CategoriesType } from '@/types/category-type';
import { decodeCategory, formatDateTime } from '@/helper/helper';
import PostsLink from './posts-link';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

function PostsCard({
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {!loading ?
                    items.length > 0 ?
                        items.map((post, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${hoveredId === post.id && selectedPosts.some((item) => item.id === post.id) ? 'bg-zinc-200/75 dark:bg-zinc-900/75' : 'hover:bg-zinc-200/75 dark:hover:bg-zinc-900/75'} p-4 border border-template rounded-lg space-y-4`}
                                    onMouseEnter={() => setHoveredId(post.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div className='flex lg:flex-row gap-4'>
                                        {post?.featuredImage && (
                                            <div className='w-64'>
                                                <PostsThumbnail key={post?.id} url={post?.featuredImage} />
                                            </div>
                                        )}
                                        <div className='w-full space-y-2'>
                                            <div className='flex flex-wrap justify-between items-center gap-3'>
                                                <div className='flex items-center gap-3'>
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
                                                <div className='inline-block'>
                                                    <div className='h-7 flex justify-center items-center border border-template rounded px-2 line-clamp-1 text-xs font-medium text-black dark:text-white text-nowrap'>
                                                        <UserRoundIcon className='inline h-4 w-4 mb-0.5 me-1' />{post?.author?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='line-clamp-2 hidden md:flex flex-wrap items-center gap-1'>
                                                {post.categories.length > 0 && post?.categories?.slice(0, 6).map((category: CategoriesType, index: number) => {
                                                    return (
                                                        <div key={index} className='bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                                                            {category.name}
                                                        </div>
                                                    )
                                                })}
                                                {post?.categories?.length > 6 && (
                                                    <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                        +{post.categories.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className='line-clamp-3 text-lg font-semibold text-black dark:text-white'>{post?.title}</div>
                                        <div className='line-clamp-2 text-sm'>{post?.excerpt}</div>
                                        <div className='flex md:hidden flex-wrap items-center gap-1'>
                                            {post.categories.length > 0 && post?.categories?.slice(0, 6).map((category: CategoriesType, index: number) => {
                                                return (
                                                    <div key={index} className='bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                                                        {category.name}
                                                    </div>
                                                )
                                            })}
                                            {post?.categories?.length > 6 && (
                                                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    +{post.categories.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        <div className='line-clamp-2 flex flex-wrap items-center gap-1'>
                                            {post.tags.length > 0 && post?.tags?.slice(0, 6).map((tag: string, index: number) => {
                                                return (
                                                    <div key={index} className='border border-template text-zinc-800 dark:text-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                                                        #{tag}
                                                    </div>
                                                )
                                            })}
                                            {post?.tags?.length > 6 && (
                                                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    +{post.tags.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className='space-y-2'>
                                                <p className='text-sm'>Action :</p>
                                                <div className='flex items-center gap-2'>
                                                    <Checkbox
                                                        checked={selectedPosts.map((item) => item.id).includes(post.id)}
                                                        onClick={() => toggleSelection(post.id, post.title)}
                                                        variant={'primary'}
                                                    />
                                                    <p className='text-sm'>Select this post</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className='col-span-2'>
                                <div className='p-4 border-b border-template text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                    You don&apos;t have any posts yet.
                                </div>
                            </div>
                        ) : (
                            <div
                            className={`p-4 border border-template rounded-lg space-y-4`}>
                            <div className='flex lg:flex-row gap-4'>
                                <Skeleton className='aspect-video w-64'  />
                                <div className='w-full space-y-2'>
                                    <div className='flex flex-wrap justify-between items-center gap-3'>
                                        <div className='flex items-center gap-3'>
                                            <Skeleton className='h-7 w-16' />
                                            <Skeleton className='h-7 w-16' />
                                        </div>
                                        <Skeleton className='h-7 w-32' />
                                    </div>
                                    <div className='hidden md:flex flex-wrap items-center gap-1'>
                                        {[1, 2, 3, 4, 5, 6].map((index) => {
                                            return (
                                                <Skeleton key={index} className='h-6 w-20' />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <Skeleton className='h-6 w-44 md:w-72 rounded-full' />
                                <Skeleton className='h-6 w-56 md:w-96 rounded-full' />
                                <div className='flex md:hidden flex-wrap items-center gap-1'>
                                    {[1, 2, 3, 4, 5, 6].map((index) => {
                                        return (
                                            <Skeleton key={index} className='h-6 w-20' />
                                        )
                                    })}
                                </div>
                                <div className='line-clamp-2 flex flex-wrap items-center gap-1'>
                                    {[1, 2, 3, 4, 5, 6].map((index) => {
                                        return (
                                            <Skeleton key={index} className='h-6 w-16' />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default PostsCard