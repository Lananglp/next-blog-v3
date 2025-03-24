'use client'
import InputSearch from '@/components/input/input-search'
import { Pagination } from '@/components/pagination'
import Template from '@/components/template-custom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { decodeCategory, formatTimeAgo } from '@/helper/helper'
import { useFetchCategories } from '@/hooks/use-fetch-categories'
import { useFetchPosts } from '@/hooks/use-fetch-posts'
import { CategoriesType } from '@/types/category-type'
import { LinkIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useMedia } from 'react-use'

type CategoryWithPostType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    posts: {
        altText: string | null | undefined;
        title: string;
        excerpt: string;
        featuredImage: string;
        createdAt: Date;
        author: {
            name: string;
        };
    };
}

type Props = {
    category: CategoryWithPostType;
}

function CategoryShow({ category }: Props) {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [search, setSearch] = useState('');
    const { posts, loading, error, reload } = useFetchPosts(page, limit, search, category.id);
    const items = posts?.items || [];
    const breakpoint = useMedia('(min-width: 1024px)');
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    if (!mount) return null;

    return (
        <Template>
            <div className='mb-2'>
                <h1 className='text-xl md:text-2xl lg:text-3xl'>Category : <span className='font-medium text-black dark:text-white'>{category.name}</span></h1>
            </div>
            <div className='flex flex-col lg:flex-row gap-4'>
                {breakpoint && <OtherCategory category={category} />}
                <div className='w-full'>
                    <div className='mb-0 lg:mb-2 sticky top-[3.5rem] pb-2 pt-2 bg-white dark:bg-zinc-950/85 backdrop-blur-sm'>
                        <div className='hidden lg:block'>
                            <InputSearch className='h-auto lg:h-12 rounded-lg' onSearch={(value) => setSearch(value)} placeholder='Search...' />
                        </div>
                        <div className='w-full flex lg:hidden items-center gap-1'>
                            <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><SearchIcon /> Search...</Button>
                            {/* {!breakpoint && (
                                <div>
                                    <ModalOtherCategory />
                                </div>
                            )} */}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {!loading ? items.length > 0 ? items.map((item, index) => {
                            return (
                                <div key={index} className='w-full space-y-4'>
                                    <Link href={decodeCategory(item.categories[0].name, item.slug)}>
                                        <div>
                                            <Image priority src={`${item.featuredImage}?tr=f-webp`} alt={item.altText || "Featured Image"} width={320} height={180} className='w-full h-full aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                                        </div>
                                    </Link>
                                    <div className='w-full space-y-2'>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 font-medium text-black dark:text-white'>{item.title}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-2 text-xs md:text-sm'>{item.excerpt}</Link>
                                        <Link href={decodeCategory(item.categories[0].name, item.slug)} className='text-xs'><span className='font-semibold text-black dark:text-white'>{item.author.name}</span> &nbsp; | &nbsp; {item.createdAt && formatTimeAgo(item.createdAt)}</Link>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className='text-sm text-zinc-500'>No posts found.</p>
                        ) : (
                            <>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                                    <div key={index} className='w-full flex flex-col gap-4'>
                                        <div className='w-full aspect-video rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                        <div className='space-y-2'>
                                            <div className='w-full h-4 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                            <div className='w-2/3 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                        </div>
                                        <div className='w-full h-9 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                        <div className='flex items-center gap-1'>
                                            <div className='w-24 h-3.5 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                            <div className='w-36 h-3.5 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <Pagination className='mt-4' align='start' currentPage={page} totalData={posts?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => setPage(value)} />
                </div>
            </div>
        </Template>
    )
}

const OtherCategory = ({ category }: { category: CategoriesType }) => {

    const { categories, loading } = useFetchCategories();
    const items = categories?.items || [];

    return (
        <div className="hidden lg:block min-w-72 max-w-72">
            <div className='sticky top-[4rem] mt-2 w-full h-auto md:h-[calc(100svh-10rem)] border border-template rounded-lg space-y-2'>
                <div className='h-full flex flex-col'>
                    <div className='px-4 pt-4 pb-2'>
                        <p className='mb-2 text-sm text-black dark:text-white font-medium'>Other Category :</p>
                    </div>
                    <ScrollArea type='always' className='flex-grow px-4'>
                        <ScrollBar orientation='horizontal' />
                        <div className='flex flex-wrap gap-1'>
                            {!loading ? items.length > 0 ? items.filter((item) => item.id !== category.id).map((item, index) => {
                                return (
                                    <Link key={index} href={decodeCategory(item.name)} className='w-full block'>
                                        <Button type="button" variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><LinkIcon />{item.name}</Button>
                                    </Link>
                                )
                            }) : (
                                <p className='text-sm text-zinc-500'>No categories found.</p>
                            ) : (
                                <>
                                    <Skeleton className='w-full h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-full h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-full h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
                                    <Skeleton className='w-full h-8 rounded-lg bg-zinc-200 dark:bg-zinc-900' />
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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type='button' disabled={loading} variant={selectedCategory.id ? 'primary' : 'editorBlockBar'} size={'iconSm'}><SlidersHorizontalIcon /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter by category</DialogTitle>
                    <DialogDescription>
                        Please select a category to filter your posts
                    </DialogDescription>
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

export default CategoryShow