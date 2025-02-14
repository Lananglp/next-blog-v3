'use client'
import { RootState } from '@/lib/redux';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import '@/app/text-editor-preview.css';
import { Heart, MessageCircleMore, UserRound } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

function PreviewPage() {

  const navigate = useRouter();
  const { post } = useSelector((state: RootState) => state.postPreview);

  if (!post.title) {
    navigate.push("/admin/post/create-biasa");
  }

  const parseHTML = (content: string) => {
    const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

    return html;
  }

  return (
    <div className='container mx-auto max-w-3xl py-12'>
      <h1 className='font-medium mb-4'>{post.title}</h1>
      <div className='flex justify-between items-end gap-2 border-b border-zinc-800 pb-4 mb-4'>
        <div className='flex items-center gap-3'>
          <div className='width-[38px] h-[38px] aspect-square'>
            {/* <img src="https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg" alt="author-image" width={38} height={38} className='aspect-square rounded-full' /> */}
            <div className='relative w-full h-full bg-zinc-800 rounded-full'>
              <UserRound className='text-zinc-400 w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
            </div>
          </div>
          <div>
            <p className='font-medium'>Author Name</p>
            <p className='text-zinc-400 text-sm'>Published on Monday, March 10, 2023 10:00</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {/* <p><FaRegHeart className='inline w-5 h-5 mb-0.5 me-1' />0</p> */}
          <p><FaHeart className='text-red-500 inline w-5 h-5 mb-0.5 me-1' />458</p>
          <p><MessageCircleMore className='inline w-5 h-5 mb-0.5 me-1' />5</p>
        </div>
      </div>
      {/* <img src="https://akcdn.detik.net.id/visual/2018/03/23/7c8ca5a9-9e5e-42a2-864b-b8015e5ffb17_169.jpeg?w=900&q=80" alt="image-exmaple" className='' /> */}
      <p className='text-zinc-500 text-xs mt-2 mb-4'>picture by unkown</p>
      <div dangerouslySetInnerHTML={{ __html: parseHTML(post.content) }}></div>
      <p>{post.categories}</p>
      <p>{post.tags}</p>
      {/* <p className='py-32'>{parseHTML(post.content)}</p> */}
    </div>
  )
}

export default PreviewPage