import { Metadata } from 'next';
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: "Manage Posts",
};

function PostPage() {
  return (
    <div>
        <h6>Post</h6>
        <Link href='/admin/post/create' className='mt-2 border'>create Post</Link>
    </div>
  )
}

export default PostPage