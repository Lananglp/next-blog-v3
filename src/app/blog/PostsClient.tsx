'use client'
import InputSearch from '@/components/input/input-search'
import { Pagination } from '@/components/pagination'
import PostCard, { PostCardSkeleton } from '@/components/post/post-card'
import Template from '@/components/template-custom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { decodeCategory, formatTimeAgo } from '@/helper/helper'
import { useFetchCategories } from '@/hooks/use-fetch-categories'
import { useFetchPosts } from '@/hooks/use-fetch-posts'
import { CategoriesType, initialCategory } from '@/types/category-type'
import { AtSignIcon, EyeIcon, SearchIcon, SlidersHorizontalIcon, Terminal, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useMedia } from 'react-use'

function PostsClient() {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoriesType>(initialCategory);
    const { posts, loading, error, reload } = useFetchPosts(page, limit, search, selectedCategory.id);
    const items = posts?.items || [];
    const breakpoint = useMedia('(min-width: 1024px)');
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    if (!mount) return null;

    return (
        <Template>
            <div className='flex flex-col lg:flex-row gap-4'>
                {breakpoint && <FilterByCategory selectedCategory={selectedCategory} onSelectionChange={(value) => setSelectedCategory(value)} />}
                <div className='w-full'>
                    <div className='mb-0 lg:mb-2 sticky top-[3.5rem] pb-2 pt-2 bg-white dark:bg-zinc-950/85 backdrop-blur-sm'>
                        <div className='hidden lg:block'>
                            <InputSearch className='h-auto lg:h-12 rounded-lg' onSearch={(value) => setSearch(value)} placeholder='Search...' />
                        </div>
                        <div className='w-full flex lg:hidden items-center gap-1'>
                            <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><SearchIcon /> Search...</Button>
                            {!breakpoint && (
                                <div>
                                    <ModalFilterByCategory selectedCategory={selectedCategory} onSelectionChange={(value) => setSelectedCategory(value)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {!loading ? items.length > 0 ? items.filter((i) => i.status === 'PUBLISH').map((item, index) => {
                            return (
                                <PostCard key={index} item={item} />
                            )
                        }) : (
                            <p className='text-sm text-zinc-500'>No posts found.</p>
                        ) : (
                            <PostCardSkeleton />
                        )}
                    </div>
                    <Pagination className='mt-4' align='start' currentPage={page} totalData={posts?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => setPage(value)} />
                </div>
            </div>
        </Template>
    )
}

type FilterByCategoryProps = {
    selectedCategory: CategoriesType;
    onSelectionChange: (value: CategoriesType) => void;
}

const FilterByCategory = ({ onSelectionChange, selectedCategory }: FilterByCategoryProps) => {

    const [search, setSearch] = useState('');
    const { categories, loading } = useFetchCategories(undefined, undefined, undefined, search);
    const items = categories?.items || [];

    const handleSelectionChange = (item: CategoriesType) => {
        onSelectionChange(item);
        setSearch('');
    }

    return (
        <div className="hidden lg:block min-w-72 max-w-72">
            <div className='sticky top-[4rem] mt-2 w-full h-auto md:h-[calc(100svh-10rem)] border border-template rounded-lg space-y-2'>
                <div className='h-full flex flex-col'>
                    <div className='px-4 pt-4 pb-2'>
                        <p className='mb-2 text-sm text-black dark:text-white font-medium'>Filter by Category :</p>
                        {selectedCategory.id ? (
                            <div className='mb-4 px-2 h-9 flex justify-between items-center gap-2 bg-zinc-200 dark:bg-zinc-900 border border-template text-sm text-black dark:text-white rounded-lg'>
                                <div className='ps-2 line-clamp-1'>{selectedCategory.name}</div>
                                <Button title='Clear this filter' type='button' onClick={() => handleSelectionChange(initialCategory)} variant={'ghost'} size={'iconSm'}><XIcon /></Button>
                            </div>
                        ) : (
                            <InputSearch className='mb-4' onSearch={(value) => setSearch(value)} placeholder='Search categories...' />
                        )}
                        <p className='mb-2 text-sm text-black dark:text-white font-medium'>Categories :</p>
                    </div>
                    <ScrollArea type='always' className='flex-grow px-4'>
                        <ScrollBar orientation='horizontal' />
                        <div className='flex flex-wrap gap-1'>
                            {!loading ? items.length > 0 ? items.map((item, index) => {
                                return (
                                    <Button key={index} type="button" onClick={() => handleSelectionChange(item)} variant={selectedCategory.id === item.id ? 'primary' : 'editorBlockBar'} size={'sm'}>{item.name}</Button>
                                )
                            }) : (
                                <p className='text-sm text-zinc-500'>No categories found.</p>
                            ) : (
                                <>
                                    <Skeleton className='w-48 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-16 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-32 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-24 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-48 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-24 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-16 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-32 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

type ModalFilterByCategoryProps = {
    selectedCategory: CategoriesType;
    onSelectionChange: (value: CategoriesType) => void;
}

const ModalFilterByCategory = ({ onSelectionChange, selectedCategory }: ModalFilterByCategoryProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const { categories, loading } = useFetchCategories(undefined, undefined, undefined, search);
    const items = categories?.items || [];

    const handleSelectionChange = (item: CategoriesType) => {
        onSelectionChange(item);
        setSearch('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type='button' disabled={loading} variant={selectedCategory.id ? 'primary' : 'editorBlockBar'} size={'iconSm'} className='relative'><SlidersHorizontalIcon /> {selectedCategory.id && <div className='absolute -top-1.5 -end-1.5 rounded-full w-4 h-4 text-[8px] bg-red-500'><span className='absolute -top-[1px] left-1/2 -translate-x-1/2'>1</span></div>}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter by category</DialogTitle>
                    <DialogDescription>
                        Please select a category to filter your posts
                    </DialogDescription>
                    {selectedCategory.id ? (
                        <div className='mt-4 px-2 h-9 flex justify-between items-center gap-2 bg-zinc-200 dark:bg-zinc-900 border border-template text-sm text-black dark:text-white rounded-lg'>
                            <div className='ps-2 line-clamp-1'>{selectedCategory.name}</div>
                            <Button title='Clear this filter' type='button' onClick={() => handleSelectionChange(initialCategory)} variant={'ghost'} size={'iconSm'}><XIcon /></Button>
                        </div>
                    ) : (
                        <InputSearch className='mt-4' onSearch={(value) => setSearch(value)} placeholder='Search categories...' />
                    )}
                    <div className="pt-4 flex flex-wrap gap-1">
                        {items.length > 0 && items.map((item, index) => {
                            return (
                                <Button key={index} type="button" onClick={() => handleSelectionChange(item)} variant={selectedCategory.id === item.id ? 'primary' : 'editorBlockBar'} size={'sm'}>{item.name}</Button>
                            )
                        })}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default PostsClient