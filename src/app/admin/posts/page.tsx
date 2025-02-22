import { Metadata } from 'next';
import Link from 'next/link'
import Posts from './Posts';

export const metadata: Metadata = {
  title: "Manage your Posts",
};

function PostPage() {
  return (
    <div>
        {/* <h6>Post</h6>
        <Link href='/admin/posts/create' className='mt-2 border'>create Post</Link> */}
        <Posts />
    </div>
  )
}

export default PostPage