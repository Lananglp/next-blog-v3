import { Checkbox } from '@/components/ui/checkbox'
import { SelectedType } from '@/types/all-type';
import { PostType } from '@/types/post-type';
import { Loader2, Settings2, UserRoundIcon, XIcon } from 'lucide-react';
import React from 'react'
import PostsThumbnail from './posts-thumbnail';
import { CategoriesType } from '@/types/category-type';
import { formatDateTime } from '@/helper/helper';
import PostsLink from './posts-link';
import { Button } from '@/components/ui/button';

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

function PostsTable({
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
            <div className="w-full overflow-x-auto focus:outline focus:outline-1 focus:outline-blue-500">
                <table className='w-full'>
                    <thead>
                        <tr>
                            {isSelected && <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-center'>Actions</th>}
                            <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-center'>No</th>
                            <th className='max-w-64 px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Author</th>
                            <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-center'>Thumbnail</th>
                            <th className='min-w-96 px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Title</th>
                            <th className='min-w-96 px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Summary</th>
                            <th className='min-w-72 px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Category</th>
                            <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Link</th>
                            <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Created At</th>
                            <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading ?
                            items.length > 0 ?
                                items.map((post, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className={`${hoveredId === post.id && selectedPosts.some((item) => item.id === post.id) ? 'bg-zinc-200/75 dark:bg-zinc-900/75' : 'hover:bg-zinc-200/75 dark:hover:bg-zinc-900/75'}`}
                                            onMouseEnter={() => setHoveredId(post.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            {isSelected && (
                                                <td className='p-4 border-b border-template text-center'>
                                                    <div className='flex items-center'>
                                                        <Checkbox
                                                            checked={selectedPosts.map((item) => item.id).includes(post.id)}
                                                            onClick={() => toggleSelection(post.id, post.title)}
                                                            variant={'primary'}
                                                        />
                                                    </div>
                                                </td>
                                            )}
                                            <td className='p-4 border-b border-template text-center'>{(page - 1) * limit + index + 1}</td>
                                            <td className='p-4 border-b border-template text-start'>
                                                <div className='line-clamp-1 text-sm font-medium text-black dark:text-white text-nowrap'>
                                                    <UserRoundIcon className='inline h-4 w-4 mb-0.5 me-1' />{post?.author?.name}
                                                </div>
                                            </td>
                                            <td className='p-1 border-b border-template text-center'>
                                                {post?.image && <PostsThumbnail key={post?.id} url={post?.image} />}
                                            </td>
                                            <td className='p-4 border-b border-template text-start'>
                                                <div className='line-clamp-3 text-black dark:text-white'>
                                                    {post?.title}
                                                </div>
                                            </td>
                                            <td className='p-4 border-b border-template text-start'>
                                                <div className='line-clamp-2 text-sm'>
                                                    {post?.description}
                                                </div>
                                            </td>
                                            <td className='p-4 border-b border-template text-start'>
                                                <div className='line-clamp-3 flex flex-wrap flex- items-center gap-1'>
                                                    {post.categories.length > 0 && post?.categories?.slice(0, 5).map((category: CategoriesType, index: number) => {
                                                        return (
                                                            <div key={index} className='bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 px-2 py-1 rounded-md text-xs font-medium'>
                                                                {category.name}
                                                            </div>
                                                        )
                                                    })}
                                                    {post?.categories?.length > 5 && (
                                                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                            +{post.categories.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='p-4 border-b border-template text-start'>
                                                {post.categories.length > 0 && <PostsLink origin={origin} post={post} />}
                                            </td>
                                            <td className='p-4 border-b border-template text-start text-nowrap text-sm text-zinc-500'>{post?.createdAt ? formatDateTime(post?.createdAt.toString()) : ''}</td>
                                            <td className='p-4 border-b border-template text-start text-nowrap text-sm text-zinc-500'>{post?.updatedAt !== post?.createdAt ? formatDateTime(post?.updatedAt.toString()) : '-'}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={9} className='p-4 border-b border-template text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                            You don&apos;t have any posts yet.
                                        </td>
                                    </tr>
                                ) : (
                                <tr>
                                    <td colSpan={9} className='p-4 border-b border-template text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                        <Loader2 className="inline h-4 w-4 mb-0.5 me-2 animate-spin" />Please wait...
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PostsTable