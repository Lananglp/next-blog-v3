'use client'

import { Button } from "@/components/ui/button";
import { PostType } from "@/types/post-type";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useClipboard } from "react-haiku";

export default function PostsLink({ origin, post }: { origin: string | undefined, post: PostType }) {

    const clipboard = useClipboard({ timeout: 2000 });
    const postUrl = `${origin}/${post?.categories[0].name.split(' ').join('-').toLowerCase()}/${post.slug}`

    return (
        <div className='group flex items-center gap-1'>
            <div className='max-w-80 truncate text-nowrap text-sm'>
                <Link target="_blank" href={postUrl}><LinkIcon className='inline h-4 w-4 mb-0.5 me-2' />{postUrl}</Link>
            </div>
            <Button type='button' onClick={() => clipboard.copy(postUrl)} className='group-hover:opacity-100 opacity-0' variant={'transparent'} size={'iconXs'}>{clipboard.copied ? <CheckIcon /> : <CopyIcon />}</Button>
        </div>
    );
};