'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deletePosts } from '@/app/api/function/posts'
import FilterDataPerPage from '@/components/filter/data-per-page'
import InputSearch from '@/components/input/input-search'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { setTitle } from '@/context/titleSlice'
import { formatDateTime } from '@/helper/helper'
import { useFetchPosts } from '@/hooks/use-fetch-posts'
import { CheckIcon, CopyIcon, EditIcon, ImageOffIcon, LinkIcon, Loader2, PenLine, SearchIcon, Settings2, TrashIcon, UserRoundIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useClipboard, useMediaQuery, useSingleEffect } from 'react-haiku'
import { useDispatch } from 'react-redux'
import { useToast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { responseStatus } from "@/helper/system-config"
import { SelectedType } from "@/types/all-type"
import { CategoriesType, initialCategory } from "@/types/category-type"
import { PostType } from "@/types/post-type"
import { AnimatePresence, motion } from "motion/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFetchCategories } from "@/hooks/use-fetch-categories"
import { usePageTitle } from "@/hooks/use-page-title"
import { useLocalStorage, useMount } from "react-use"
import PostsThumbnail from "./posts-component/posts-thumbnail"
import PostsLink from "./posts-component/posts-link"
import PostsTable from "./posts-component/posts-table"
import PostsSimple from "./posts-component/posts-simple"
import PostsCard from "./posts-component/posts-card"

type DataViewType = "SIMPLE" | "TABLE" | "CARD";

function Posts() {

    usePageTitle("Manage your posts");

    const origin = process.env.NEXT_PUBLIC_API_URL;
    const navigate = useRouter();
    const [mounted, setMounted] = useState(false);
    const [dataView, setDataView, removeDataView] = useLocalStorage<DataViewType>('dataView', 'SIMPLE');
    const breakpoint = useMediaQuery('(min-width: 1280px)', true);
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoriesType>(initialCategory);
    const { posts, loading, error, reload } = useFetchPosts(page, limit, search, selectedCategory.id);
    const [selectedPosts, setSelectedPosts] = useState<SelectedType>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const items = posts?.items || [];

    useMount(() => {
        setMounted(true);
    });

    const toggleSelection = (id: string, title: string) => {
        setSelectedPosts((prev) =>
            prev.some((post) => post.id === id)
                ? prev.filter((post) => post.id !== id)
                : [...prev, { id, title }]
        );
    };

    const toggleAllSelection = (items: SelectedType) => {
        if (selectedPosts.length === items.length) {
            setSelectedPosts([]);
            setIsSelected(false);
        } else {
            setSelectedPosts(items);
        }
    };

    const handleDeleteSelectedPosts = async () => {
        if (selectedPosts.length === 0) return;

        // const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`);
        // if (!confirmDelete) return;

        try {
            const idsToDelete = selectedPosts.map((post) => post.id);
            const res = await deletePosts(idsToDelete);

            if (res.data.status === responseStatus.success) {
                reload();
                setSelectedPosts([]);
                toast({
                    title: res.data.status,
                    description: res.data.message,
                })   
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response);
                toast({
                    title: "Ops...",
                    description: `${error.response?.data?.message}. (${error.response?.status.toString()})` || "Terjadi kesalahan",
                })
            } else {
                console.log("Unknown error:", error);
            }
        }
    };

    const handlePageChange = (value: number) => {
        setPage(value);
        setSelectedPosts([]);
    }

    if (!mounted) return null;

    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-wrap flex-col lg:flex-row justify-between gap-2'>
                <div>
                    <Button type='button' onClick={() => navigate.push('/admin/posts/create')} variant={'primary'} className='w-full'><PenLine />Create new post</Button>
                </div>
                <div className='flex flex-col md:flex-wrap lg:flex-row items-center gap-2'>
                    <FilterByCategory selectedCategory={selectedCategory} onSelectionChange={(value) => setSelectedCategory(value)} />
                    <FilterDataPerPage
                        value={limit}
                        onValueChange={(value) => setLimit(value)}
                        className="w-full lg:w-48"
                    />
                    <div className='w-full lg:w-80'>
                        <InputSearch placeholder='Search ...' onSearch={(value) => setSearch(value)} className='w-full' />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
                <AnimatePresence mode='wait'>
                    {breakpoint && selectedPosts.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="col-span-12 lg:col-span-3">
                            <div className='sticky top-[11rem] min-h-[calc(100vh-12.1rem)] flex flex-col bg-zinc-100 dark:bg-zinc-950/50 border border-template rounded-lg'>
                                <div className='sticky top-0 bg-zinc-100 dark:bg-zinc-950 rounded-t-lg flex justify-between items-center border-b border-template gap-1 p-2'>
                                    <p className='p-2 text-sm'>{selectedPosts.length} selected</p>
                                    <Button type='button' onClick={() => {setSelectedPosts([]); setIsSelected(false)}} variant={'transparent'} size={'iconSm'}><XIcon /></Button>
                                </div>
                                <div className="flex-grow max-h-[calc(100vh-19rem)] overflow-y-auto">
                                    {selectedPosts.map((category, index) => (
                                        <div
                                            key={category.id}
                                            className={`flex justify-between items-center border-b border-template p-2
                                                ${hoveredId === category.id && selectedPosts.some((item) => item.id === category.id) ? 'bg-zinc-200/75 dark:bg-zinc-800' : ''}`}
                                            onMouseEnter={() => setHoveredId(category.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <p className='w-full text-sm line-clamp-2 ps-2'>{index + 1}.&nbsp;{category.title}</p>
                                            <Button type='button' onClick={() => toggleSelection(category.id, category.title || '')} variant={'transparent'} size={'iconSm'}>
                                                <XIcon />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className='sticky bottom-0 flex items-center gap-2 p-2'>
                                    <Button type='button' onClick={() => navigate.push(`/admin/posts/edit/${selectedPosts[0].id}`)} disabled={selectedPosts.length > 1} variant={'primary'} size={'sm'} className='w-full'><EditIcon />Edit</Button>
                                    <AlertDelete totalSelected={selectedPosts.length} onConfirm={handleDeleteSelectedPosts} disabled={selectedPosts.length === 0} className="w-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className={`${breakpoint && selectedPosts.length > 0 ? 'col-span-12 lg:col-span-9' : 'col-span-12'} space-y-4`}>
                    <AnimatePresence mode='wait'>
                        {!breakpoint && selectedPosts.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className='sticky top-4 z-10 flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 bg-zinc-200 dark:bg-zinc-900 border border-template rounded-lg px-4 py-2'>
                                <p className='text-sm'>{selectedPosts.length} selected</p>
                                <div className='flex items-center gap-1'>
                                    <Button type='button' onClick={() => navigate.push(`/admin/posts/edit/${selectedPosts[0].id}`)} disabled={selectedPosts.length > 1} variant={'primary'} size={'sm'}><EditIcon />Edit</Button>
                                    <AlertDelete totalSelected={selectedPosts.length} onConfirm={handleDeleteSelectedPosts} disabled={selectedPosts.length === 0} />
                                    <Button type='button' onClick={() => {setSelectedPosts([]); setIsSelected(false)}} variant={'transparent'} size={'iconSm'} className='ms-2'><XIcon /></Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        {dataView && (
                            <div className="border border-template rounded-md flex items-center gap-1 p-1">
                                <Button type="button" onClick={() => setDataView("SIMPLE")} variant={dataView === "SIMPLE" ? 'primary' : 'ghost'} size={'sm'} className="h-7">Simple</Button>
                                <Button type="button" onClick={() => setDataView("TABLE")} variant={dataView === "TABLE" ? 'primary' : 'ghost'} size={'sm'} className="h-7">Table</Button>
                                <Button type="button" onClick={() => setDataView("CARD")} variant={dataView === "CARD" ? 'primary' : 'ghost'} size={'sm'} className="h-7">Card</Button>
                            </div>
                        )}
                        <Pagination currentPage={page} totalData={posts?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => handlePageChange(value)} />
                    </div>
                    {dataView === 'SIMPLE' && (
                        <PostsSimple
                            selectedPosts={selectedPosts}
                            items={items}
                            toggleAllSelection={(value) => toggleAllSelection(value)}
                            loading={loading}
                            hoveredId={hoveredId}
                            setHoveredId={(value) => setHoveredId(value)}
                            toggleSelection={(postId, postTitle) => toggleSelection(postId, postTitle)}
                            page={page}
                            limit={limit}
                            isSelected={isSelected}
                            isSelectedChange={(value) => {
                                setIsSelected(value);
                                setSelectedPosts([]);
                            }}
                        />
                    )}
                    {dataView === 'TABLE' && (
                        <PostsTable
                            selectedPosts={selectedPosts}
                            items={items}
                            toggleAllSelection={(value) => toggleAllSelection(value)}
                            loading={loading}
                            hoveredId={hoveredId}
                            setHoveredId={(value) => setHoveredId(value)}
                            toggleSelection={(postId, postTitle) => toggleSelection(postId, postTitle)}
                            page={page}
                            limit={limit}
                            isSelected={isSelected}
                            isSelectedChange={(value) => {
                                setIsSelected(value);
                                setSelectedPosts([]);
                            }}
                        />
                    )}
                    {dataView === 'CARD' && (
                        <PostsCard
                            selectedPosts={selectedPosts}
                            items={items}
                            toggleAllSelection={(value) => toggleAllSelection(value)}
                            loading={loading}
                            hoveredId={hoveredId}
                            setHoveredId={(value) => setHoveredId(value)}
                            toggleSelection={(postId, postTitle) => toggleSelection(postId, postTitle)}
                            page={page}
                            limit={limit}
                            isSelected={isSelected}
                            isSelectedChange={(value) => {
                                setIsSelected(value);
                                setSelectedPosts([]);
                            }}
                        />
                    )}
                    
                    <Pagination align="start" currentPage={page} totalData={posts?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => handlePageChange(value)} />
                </div>
            </div>
        </div>
    )
}

type AlertDeleteProps = {
    onConfirm: () => void;
    disabled?: boolean;
    totalSelected: number;
    className?: string;
}

function AlertDelete({ onConfirm, disabled, totalSelected=0, className }: AlertDeleteProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type='button' disabled={disabled} variant={'destructive'} size={'sm'} className={className}><TrashIcon />Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{totalSelected} selected posts will be deleted, are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This action will permanently delete your post and delete post data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

type FilterByCategoryProps = {
    selectedCategory: CategoriesType;
    onSelectionChange: (value: CategoriesType) => void;
}

const FilterByCategory = ({ onSelectionChange, selectedCategory }: FilterByCategoryProps) => {

    const { categories, loading } = useFetchCategories();
    const items = categories?.items || [];
    const [open, setOpen] = useState<boolean>(false);

    const handleSelectionChange = (item: CategoriesType) => {
        onSelectionChange(item);
        setOpen(false);
    }

    return (
        <div className="w-full lg:w-64 flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type='button' disabled={loading} variant={'editorBlockBar'} className="w-full justify-start">{!loading ? <Settings2 /> : <Loader2 className="animate-spin" />}{selectedCategory.id ? selectedCategory.name : 'Filter by category'}</Button>
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
            {selectedCategory.id && (
                <div>
                    <Button title="Clear this filter" type='button' onClick={() => handleSelectionChange(initialCategory)} disabled={loading} variant={'editorBlockBar'} size={'icon'}><XIcon /></Button>
                </div>
            )}
        </div>
    )
}

export default Posts