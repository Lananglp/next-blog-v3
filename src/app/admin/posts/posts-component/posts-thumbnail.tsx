'use client';

import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PostsThumbnail({ url }: { url: any }) {

    const [valid, setValid] = useState(true);

    if (!url) {
        return (
            <div className='relative aspect-video object-cover bg-zinc-200/50 dark:bg-zinc-900/50 text-zinc-500 rounded border border-template' >
                <ImageOffIcon className='absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5' />
            </div>
        );
    }

    return (
        <div>
            {valid ? (
                <Image unoptimized src={url} width={72} height={36} onError={() => setValid(false)} alt="thumbnail" className='aspect-video w-full h-full object-cover rounded border border-template' />
            ) : (
                <div className='relative aspect-video object-cover bg-zinc-200/50 dark:bg-zinc-900/50 text-zinc-500 rounded border border-template' >
                    <ImageOffIcon className='absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5' />
                </div>
            )}
        </div>
    );
};