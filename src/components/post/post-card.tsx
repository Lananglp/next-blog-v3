'use client'

import { decodeCategory, formatTimeAgo } from "@/helper/helper"
import { PostType } from "@/types/post-type"
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link"

interface PostCardProps {
    item: PostType;
}

function PostCard({ item }: PostCardProps) {
    return (
        <div className='w-full space-y-4'>
            <Link href={decodeCategory(item.categories[0].name, item.slug)}>
                <div>
                    <Image priority src={`${item.image}?tr=f-webp`} alt={item.altText || "Featured Image"} width={320} height={180} className='w-full h-full aspect-video rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900' />
                </div>
            </Link>
            <div className='w-full space-y-2'>
                <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-3 md:line-clamp-2 font-semibold text-black dark:text-white'>{item.title}</Link>
                <Link href={decodeCategory(item.categories[0].name, item.slug)} className='line-clamp-3 md:line-clamp-2 text-xs md:text-sm'>{item.description}</Link>
                <div className='flex flex-wrap justify-between items-center gap-2'>
                    <Link href={decodeCategory(item.categories[0].name, item.slug)} className='text-xs'><span className='font-semibold text-black dark:text-white'>{item.author.name}</span> &nbsp; | &nbsp; {item.createdAt && formatTimeAgo(item.createdAt)}</Link>
                    <Link href={decodeCategory(item.categories[0].name, item.slug)} className='text-xs'><EyeIcon className='inline w-4 h-4 mb-0.5 me-1' />127k</Link>
                </div>
            </div>
        </div>
    )
}

export default PostCard

export const PostCardSkeleton = () => {
    return (
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
    )
};