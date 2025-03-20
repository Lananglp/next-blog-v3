'use client'
import { setTitle } from '@/context/titleSlice';
import React, { useState } from 'react'
import { useMediaQuery, useSingleEffect } from 'react-haiku';
import { useDispatch } from 'react-redux';
import FilterDataPerPage from '@/components/filter/data-per-page';
import InputSearch from '@/components/input/input-search';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader, TrashIcon, XIcon } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateTime } from '@/helper/helper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AxiosError } from 'axios';
import { responseStatus } from '@/helper/system-config';
import { AnimatePresence, motion } from 'motion/react';
import { useFetchUsers } from '@/hooks/use-fetch-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserCreate from './UserCreate';
import { UserType } from '@/types/userType';
import UserEdit from './UserEdit';
import { deleteUsers } from '@/app/api/function/users';

function Users({ pageTitle }: { pageTitle: string }) {

    const dispatch = useDispatch();

    const setPageTitle = (title: string) => {
        dispatch(setTitle(title));
    }

    useSingleEffect(() => {
        setPageTitle(pageTitle);
    });

    const { toast } = useToast();
    const breakpoint = useMediaQuery('(min-width: 1280px)', true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const { users, loading, error, reload } = useFetchUsers('', page, limit, search);
    const [selectedItems, setSelectedItems] = useState<UserType[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const items = users?.items || [];

    const toggleSelection = (item: UserType) => {
        setSelectedItems((prev) => {
            if (prev.some((sc) => sc.id === item.id)) {
                return prev.filter((sc) => sc.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const toggleAllSelection = (items: UserType[]) => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items);
        }
    };

    const handleDeleteSelectedItems = async () => {
        if (selectedItems.length === 0) return;

        try {
            const idsToDelete = selectedItems.map((post) => post.id);
            const res = await deleteUsers(idsToDelete);

            if (res.data.status === responseStatus.success) {
                reload();
                setSelectedItems([]);
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
        setSelectedItems([]);
    }

    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col lg:flex-row justify-between gap-2'>
                <div>
                    <UserCreate reload={reload} onSuccess={() => setSelectedItems([])} disabled={loading} />
                </div>
                <div className='flex flex-col lg:flex-row items-center gap-2'>
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
                    {breakpoint && selectedItems.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="col-span-12 lg:col-span-3">
                            <div className='sticky top-[11rem] min-h-[calc(100vh-12.1rem)] flex flex-col bg-zinc-100 dark:bg-zinc-950/50 border border-template rounded-lg'>
                                <div className='sticky top-0 bg-zinc-100 dark:bg-zinc-950 rounded-t-lg flex justify-between items-center border-b border-template gap-1 p-2'>
                                    <p className='p-2 text-sm'>{selectedItems.length} selected</p>
                                    <Button type='button' onClick={() => setSelectedItems([])} variant={'transparent'} size={'iconSm'}><XIcon /></Button>
                                </div>
                                <div className="flex-grow max-h-[calc(100vh-19rem)] overflow-y-auto">
                                    {selectedItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`flex justify-between items-center border-b border-template p-2
                                                ${hoveredId === item.id && selectedItems.some((item) => item.id === item.id) ? 'bg-zinc-200/75 dark:bg-zinc-800' : ''}`}
                                            onMouseEnter={() => setHoveredId(item.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <p className='w-full text-sm line-clamp-2 ps-2'>{index + 1}.&nbsp;{item.name}</p>
                                            <Button type='button' onClick={() => toggleSelection(item)} variant={'transparent'} size={'iconSm'}>
                                                <XIcon />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className='sticky bottom-0 flex items-center gap-2 p-2'>
                                    <UserEdit item={selectedItems[0]} reload={reload} disabled={selectedItems.length > 1} onSuccess={() => setSelectedItems([])} />
                                    <AlertDelete totalSelected={selectedItems.length} onConfirm={handleDeleteSelectedItems} disabled={selectedItems.length === 0} className="w-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className={`${breakpoint && selectedItems.length > 0 ? 'col-span-12 lg:col-span-9' : 'col-span-12'} space-y-4`}>
                    <AnimatePresence mode='wait'>
                        {!breakpoint && selectedItems.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className='sticky top-4 z-10 flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 bg-zinc-200 dark:bg-zinc-900 border border-template rounded-lg px-4 py-2'>
                                <p className='text-sm'>{selectedItems.length} selected</p>
                                <div className='flex items-center gap-1'>
                                    <UserEdit item={selectedItems[0]} reload={reload} disabled={selectedItems.length > 1} onSuccess={() => setSelectedItems([])} />
                                    <AlertDelete totalSelected={selectedItems.length} onConfirm={handleDeleteSelectedItems} disabled={selectedItems.length === 0} />
                                    <Button type='button' onClick={() => setSelectedItems([])} variant={'transparent'} size={'iconSm'} className='ms-2'><XIcon /></Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Pagination currentPage={page} totalData={users?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => handlePageChange(value)} />
                    <div className="overflow-x-auto focus:outline focus:outline-1 focus:outline-blue-500">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th className='w-[0%] px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-center'>
                                        {items.length > 0 && (
                                            <div className='flex items-center'>
                                                <Checkbox
                                                    checked={selectedItems.length === items.length && items.length > 0}
                                                    onClick={() => toggleAllSelection(items)}
                                                    variant={'primary'}
                                                />
                                            </div>
                                        )}
                                    </th>
                                    <th className='w-[0%] px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-center'>No</th>
                                    <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Name</th>
                                    <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Email</th>
                                    <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Role</th>
                                    <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Created At</th>
                                    <th className='px-4 py-2 border-b border-template text-zinc-500 dark:text-zinc-400 text-sm font-medium text-nowrap text-start'>Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading ?
                                    items.length > 0 ?
                                        items.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className={`${hoveredId === item.id && selectedItems.some((sc) => sc.id === item.id) ? 'bg-zinc-200/75 dark:bg-zinc-900/75' : 'hover:bg-zinc-200/75 dark:hover:bg-zinc-900/75'}`}
                                                    onMouseEnter={() => setHoveredId(item.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                >
                                                    <td className='p-4 border-b border-template text-center'>
                                                        <div className='flex items-center'>
                                                            <Checkbox
                                                                checked={selectedItems.map((sc) => sc.id).includes(item.id)}
                                                                onClick={() => toggleSelection(item)}
                                                                variant={'primary'}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className='p-4 border-b border-template text-center'>{(page - 1) * limit + index + 1}</td>
                                                    <td className='p-4 border-b border-template text-start'>
                                                        <div className='line-clamp-3 text-black dark:text-white font-medium flex items-center gap-2 text-nowrap'>
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={item.image && item.image} alt="@shadcn" />
                                                                <AvatarFallback className='uppercase'>{item.name.split(' ').slice(0, 2).map((word) => word.charAt(0)).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            {item.name}
                                                        </div>
                                                    </td>
                                                    <td className='p-4 border-b border-template text-start'>{item.email}</td>
                                                    <td className='p-4 border-b border-template text-start capitalize font-medium text-zinc-500'>{item.role === 'ADMIN' ? <span className='text-black dark:text-white'>{item.role}</span> : item.role}</td>
                                                    <td className='p-4 border-b border-template text-start text-nowrap text-sm text-zinc-500'>{item?.createdAt ? formatDateTime(item?.createdAt.toString()) : ''}</td>
                                                    <td className='p-4 border-b border-template text-start text-nowrap text-sm text-zinc-500'>{item?.updatedAt !== item?.createdAt ? formatDateTime(item?.updatedAt.toString()) : '-'}</td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr>
                                                <td colSpan={7} className='p-4 border-b border-template text-center text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : (
                                        <tr>
                                            <td colSpan={7} className='p-4 animate-pulse bg-zinc-200/50 dark:bg-zinc-900/50 border-b border-template text-center text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                                <Loader className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />Loading...
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={page} totalData={users?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => handlePageChange(value)} />
                </div>
            </div>
        </div>
    )
}

export default Users

type AlertDeleteProps = {
    onConfirm: () => void;
    disabled?: boolean;
    totalSelected: number;
    className?: string;
}

function AlertDelete({ onConfirm, disabled, totalSelected = 0, className }: AlertDeleteProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type='button' disabled={disabled} variant={'destructive'} size={'sm'} className={className}><TrashIcon />Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{totalSelected} selected users will be deleted, are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This action will permanently delete your users and delete user data from our servers.
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