'use client'
import { usePageTitle } from '@/hooks/use-page-title';
import { ActivityIcon, CloudyIcon, HashIcon, ImagesIcon, PencilRulerIcon, UsersRoundIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

type Props = {
    pageTitle: string;
}

function Dashboard({ pageTitle }: Props) {

    usePageTitle(pageTitle);

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2'>
                <Link href={'/admin/users'} className='w-full px-3 py-2 md:py-2 flex items-center gap-3 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-lg'>
                    <div className='inline-block bg-white dark:bg-zinc-900 border border-template rounded-full p-2'>
                        <UsersRoundIcon />
                    </div>
                    <div className='md:space-y-1'>
                        <h6 className='font-semibold text-black dark:text-white'>Users Account</h6>
                        <p className='text-sm'>193 Admin&nbsp;|&nbsp;1843 User</p>
                    </div>
                </Link>
                <Link href={'/admin/posts'} className='w-full px-3 py-2 md:py-2 flex items-center gap-3 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-lg'>
                    <div className='inline-block bg-white dark:bg-zinc-900 border border-template rounded-full p-2'>
                        <PencilRulerIcon />
                    </div>
                    <div className='md:space-y-1'>
                        <h6 className='font-semibold text-black dark:text-white'>Posts</h6>
                        <p className='text-sm'>19332 Posts</p>
                    </div>
                </Link>
                <Link href={'/admin/categories'} className='w-full px-3 py-2 md:py-2 flex items-center gap-3 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-lg'>
                    <div className='inline-block bg-white dark:bg-zinc-900 border border-template rounded-full p-2'>
                        <HashIcon />
                    </div>
                    <div className='md:space-y-1'>
                        <h6 className='font-semibold text-black dark:text-white'>Categories</h6>
                        <p className='text-sm'>19332 Categories</p>
                    </div>
                </Link>
                <Link href={'/admin'} className='w-full px-3 py-2 md:py-2 flex items-center gap-3 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-lg'>
                    <div className='inline-block bg-white dark:bg-zinc-900 border border-template rounded-full p-2'>
                        <ImagesIcon />
                    </div>
                    <div className='md:space-y-1'>
                        <h6 className='font-semibold text-black dark:text-white'>Image Storage</h6>
                        <p className='text-sm'>19332 Images</p>
                    </div>
                </Link>
                <Link href={'/admin/profile'} className='w-full px-3 py-2 md:py-2 flex items-center gap-3 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-lg'>
                    <div className='inline-block bg-white dark:bg-zinc-900 border border-template rounded-full p-2'>
                        <ImagesIcon />
                    </div>
                    <div className='md:space-y-1'>
                        <h6 className='font-semibold text-black dark:text-white'>Your Profile</h6>
                        <p className='text-sm'>Click to configure</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard