'use client'
import React from 'react'
import '@/app/text-editor-preview.css';
import { MessageCircleMore, UserRound } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

type Props = {
    value: any
}

function PostPreview({ value } : Props) {

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }    

    return (
        <div>
            <h1 className='text-4xl font-medium mb-6'>{value.title ? value.title : <span className='text-zinc-400 dark:text-zinc-500'>The post title will appear here...</span>}</h1>
            <div className='flex justify-between items-end gap-2 border-b border-zinc-300 dark:border-zinc-800 pb-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='width-[38px] h-[38px] aspect-square'>
                        {/* <img src="https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg" alt="author-image" width={38} height={38} className='aspect-square rounded-full' /> */}
                        <div className='relative w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full'>
                            <UserRound className='text-zinc-400 w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                        </div>
                    </div>
                    <div>
                        <p className='font-medium'>Author Name</p>
                        <p className='text-zinc-400 text-sm'>Published on Monday, March 10, 2023 10:00</p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <p><FaRegHeart className='inline w-5 h-5 mb-0.5 me-1' />99k</p>
                    {/* <p><FaHeart className='text-red-500 inline w-5 h-5 mb-0.5 me-1' />458</p> */}
                    <p><MessageCircleMore className='inline w-5 h-5 mb-0.5 me-1' />99k</p>
                </div>
            </div>
            {/* <img src="https://akcdn.detik.net.id/visual/2018/03/23/7c8ca5a9-9e5e-42a2-864b-b8015e5ffb17_169.jpeg?w=900&q=80" alt="image-exmaple" className='' /> */}
            {/* <p className='text-zinc-500 text-xs mt-2 mb-4'>picture by unkown</p> */}
            {value.content.length > 7 ? <div className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(value.content) }}></div> : <p className='text-zinc-400 dark:text-zinc-500'>Post content will appear here...</p>}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 mt-12'>
                <div>
                    <label className='block border-b border-zinc-300 dark:border-zinc-800 font-medium text-sm pb-2 mb-2'>Post Category</label>
                    {value.categories.length > 0 ? (
                        <div className='flex flex-wrap items-center gap-2'>
                            {value.categories.map((category: string, index: number) => {
                                return (
                                <p key={index} className='bg-zinc-900/50 border border-zinc-800 rounded text-sm px-2 py-1'>{category}</p>
                            )})}
                        </div>
                    ) : (
                        <p className='text-zinc-400 dark:text-zinc-500'>Post category will appear here...</p>
                    )}
                </div>
                <div>
                    <label className='block border-b border-zinc-300 dark:border-zinc-800 font-medium text-sm pb-2 mb-2'>Post Tags</label>
                    {value.tags.length > 0 ? (
                        <div className='flex flex-wrap items-center gap-2'>
                            {value.tags.map((tag: string, index: number) => {
                                return (
                                <p key={index} className='bg-zinc-900/50 border border-zinc-800 rounded text-sm px-2 py-1'>#{tag}</p>
                            )})}
                        </div>
                    ) : (
                        <p className='text-zinc-400 dark:text-zinc-500'>Post tags will appear here...</p>
                    )}
                </div>
            </div>
            {/* <p className='py-32'>{parseHTML(post.content)}</p> */}
        </div>
    )
}

export default PostPreview