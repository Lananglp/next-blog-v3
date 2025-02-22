'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { setTitle } from '@/context/titleSlice'
import { PenLine, SearchIcon, UserRoundIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSingleEffect } from 'react-haiku'
import { useDispatch } from 'react-redux'

function Posts() {

    const dispatch = useDispatch();

    const setPageTitle = (title: string) => {
        dispatch(setTitle(title));
    }

    useSingleEffect(() => {
        setPageTitle('Manage your posts');
    });

    const navigate = useRouter();

    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='flex justify-between'>
                {/* <div>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div> */}
                <div>
                    <Button type='button' onClick={() => navigate.push('/admin/posts/create')} variant={'primary'} className='w-full'><PenLine />Create new post</Button>
                </div>
                <div className='relative'>
                    <Input type="text" name="" id="" variant={'primary'} placeholder='Search ...' className='w-80 ps-8' />
                    <SearchIcon className='dark:text-zinc-400 absolute start-2 top-1/2 -translate-y-1/2 h-4 w-4' />
                </div>
            </div>
            <div className='overflow-x-auto border-x border-template focus:outline focus:outline-1 focus:outline-blue-500'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>
                                <div className='flex items-center'>
                                    <Checkbox variant={'primary'} />
                                </div>
                            </th>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>No</th>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Thumbnail</th>
                            <th className='min-w-64 px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Title</th>
                            <th className='min-w-96 px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Summary</th>
                            <th className='min-w-64 px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Author</th>
                            <th className='min-w-64 px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Category</th>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Created At</th>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Updated At</th>
                            <th className='px-3 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-template text-zinc-950 dark:text-white text-sm font-semibold dark:font-medium text-nowrap'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='px-3 py-1 border border-template text-center'>
                                <div className='flex items-center'>
                                    <Checkbox variant={'primary'} />
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-center'>1</td>
                            <td className='px-3 py-1 border border-template text-center'>
                                <div>
                                    <Image src="/api/uploads/image-2025-02-21-1740132093151.png" width={72} height={72} alt="thumbnail" />
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-start'>
                                <div className='line-clamp-3'>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing.
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-start'>
                                <div className='line-clamp-3 text-sm'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis iure, enim fugiat temporibus maiores debitis pariatur molestiae nulla quis saepe ratione quas assumenda corporis deserunt esse dicta obcaecati dolorum odit.
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-start'>
                                <div className='line-clamp-3'>
                                    <UserRoundIcon className='inline h-4 w-4 mb-0.5 me-1' />Admin User
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-start'>
                                <div className='line-clamp-3 flex flex-wrap flex- items-center gap-1'>
                                    <span className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm px-2.5 py-0.5">
                                        Technology
                                    </span>
                                    <span className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm px-2.5 py-0.5">
                                        News
                                    </span>
                                    <span className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm px-2.5 py-0.5">
                                        Hots
                                    </span>
                                    <span className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm px-2.5 py-0.5">
                                        Ai
                                    </span>
                                    <span className="text-sm">
                                        +5 more
                                    </span>
                                </div>
                            </td>
                            <td className='px-3 py-1 border border-template text-start'>Created At</td>
                            <td className='px-3 py-1 border border-template text-start'>Updated At</td>
                            <td className='px-3 py-1 border border-template text-start'>Actions</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Posts