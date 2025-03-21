'use client'
import InputSearch from '@/components/input/input-search'
import Template from '@/components/template-custom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { AtSignIcon, CirclePlusIcon, EllipsisVerticalIcon, HashIcon, LayoutDashboardIcon, SearchIcon, SlidersHorizontalIcon, Terminal } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

function PostsClient() {

    const [search, setSearch] = useState<string>('');
    const [searchCategories, setSearchCategories] = useState<string>('');

    return (
        <Template>
            {/* <div>
                <div className='mb-8'>
                    <div className='relative flex flex-col justify-end w-full'>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }} className='absolute inset-x-0 md:inset-auto top-0 md:top-auto md:relative h-auto md:h-[42rem] aspect-[4/3]'>
                            <div className='absolute inset-0 bg-gradient-to-t from-zinc-950 from-[0%] to-transparent to-[50%]' />
                            <div className='absolute inset-0 bg-gradient-to-b from-zinc-950 from-[0%] to-transparent to-[20%] md:to-[10%]' />
                            <div className='absolute inset-0 bg-gradient-to-r from-zinc-950/50 md:from-zinc-950 from-[0%] to-transparent to-[5%] md:to-[30%]' />
                            <div className='absolute inset-0 bg-gradient-to-l from-zinc-950/50 md:from-zinc-950 from-[0%] to-transparent to-[5%] md:to-[30%]' />
                            <Image unoptimized src={'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt='bg1' width={1920} height={1080} className='w-full h-full object-cover' />
                        </motion.div>
                        <div className='static md:absolute z-10 inset-x-0 top-56 sm:top-80 md:top-auto md:bottom-0  pt-64 md:pt-0 px-8 xl:px-0'>
                            <span className='block  text-orange-400 text-md'>#1 Trending Today</span>
                            <Link href='#' className='inline-block  text-sky-400 hover:text-sky-300 font-medium mb-3 text-lg'>Science & Technology</Link>
                            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className=' font-medium text-3xl md:text-4xl lg:text-6xl line-clamp-6 lg:line-clamp-2 max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-4xl mb-6 lg:mb-8'>Outside the Box: A Famous Professor’s AI Brain</motion.h1>
                            <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }} className=' text-zinc-300 max-w-xl lg:max-w-4xl line-clamp-6 lg:line-clamp-3 text-md leading-7 mb-3'>In “Outside the Box,” I interrogate ChatGPT to better understand how AI “reasons.” This week, we explore a new development: chatbots designed to express the mind of an identified human personality, living or dead, historical or fiction. This could be a step towards giving AI its missing social dimension.</motion.p>
                            <span className=' text-zinc-300'>By <Link href='#' className='underline hover:text-white'>Peter Isackson</Link></span>
                            <Link href='#' className='block  bg-gradient-radial from-zinc-900/75 hover:from-sky-900/75 from-[0%] to-transparent to-[70%] text-sky-400 hover:text-sky-300 text-center font-medium py-4 mt-3 text-lg'>Read More</Link>
                        </div>
                    </div>
                </div>
            </div> */}
            <Alert className='mb-2'>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You&apos;re on the blog page but this page is still in maintenance.
                </AlertDescription>
            </Alert>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='hidden lg:block w-full lg:w-96'>
                    <div className='sticky top-[4rem] mt-2 w-full h-auto md:h-[calc(100svh-10rem)] border border-template rounded-lg space-y-2'>
                        {/* <div className="flex items-center space-x-2">
                            <Switch id="posts-trending" />
                            <Label htmlFor="posts-trending">Trending posts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="airplane-mode" />
                            <Label htmlFor="airplane-mode">Latest posts</Label>
                        </div> */}
                        <div className='h-full flex flex-col'>
                            <div className='px-4 pt-4 pb-2'>
                                <p className='mb-2 text-sm text-black dark:text-white font-medium'>Filter by Category :</p>
                                <InputSearch className='mb-4' onSearch={(value) => setSearchCategories(value)} placeholder='Search categories...' />
                                <p className='mb-2 text-sm text-black dark:text-white font-medium'>Categories :</p>
                            </div>
                            <ScrollArea type='always' className='flex-grow px-4'>
                                <ScrollBar orientation='horizontal' />
                                <div className='space-y-1'>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Sandiwara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Nusantara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bali</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Olahraga & Kesehatan</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bencana Alam</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Sandiwara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Nusantara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bali</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Olahraga & Kesehatan</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bencana Alam</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Sandiwara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Nusantara</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bali</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Olahraga & Kesehatan</Button>
                                    <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><AtSignIcon />Bencana Alam</Button>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='mb-0 lg:mb-2 sticky top-[3.5rem] pb-2 pt-2 bg-white dark:bg-zinc-950/85 backdrop-blur-sm'>
                        <div className='hidden lg:block'>
                            <InputSearch className='h-auto lg:h-12 rounded-lg' onSearch={(value) => setSearch(value)} placeholder='Search posts, title, author...' />
                        </div>
                        <div className='w-full flex lg:hidden items-center gap-1'>
                            <Button type='button' variant={'editorBlockBar'} size={'sm'} className='w-full justify-start'><SearchIcon /> Search...</Button>
                            <Button type='button' variant={'editorBlockBar'} size={'iconSm'}><SlidersHorizontalIcon /></Button>
                        </div>
                        {/* <div className='flex justify-between items-center gap-2 px-2 pb-2'>
                            <p className='text-sm text-black dark:text-white font-medium'>Posts :</p>
                            <p className='text-sm'>9 data result</p>
                        </div> */}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[1,2,3,4,5,6,7,8,9].map((woi, index) => {
                            return (
                                <div key={index} className='w-full flex flex-col gap-4'>
                                    <Link href={'#'} className='block aspect-video w-full h-full rounded-lg'>
                                        <div className='w-full h-full aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                                    </Link>
                                    <div className='w-full space-y-2'>
                                        <Link href={'#'} className='line-clamp-2 font-medium text-black dark:text-white'>Lorem ipsum dolor sit amet, consectetur adipisicing.</Link>
                                        <Link href={'#'} className='line-clamp-2 text-xs md:text-sm'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia minima ea cupiditate dignissimos asperiores in! Aut rem nulla alias quae fuga, tempora provident error inventore itaque ipsam fugit perspiciatis tenetur?</Link>
                                        <Link href={'#'} className='text-xs'><span className='font-semibold text-black dark:text-white'>Jhon Rembo Reborn</span> &nbsp; | &nbsp; 7 days ago</Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Template>
    )
}

export default PostsClient