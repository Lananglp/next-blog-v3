'use client'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button';
import { MoveLeftIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux';

function PageTitle() {

    const { title } = useSelector((state: RootState) => state.pageTitle);
    const pathname = usePathname();
    const navigate = useRouter();

    return (
        <div className="flex items-center gap-2 border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-4">
            {pathname !== '/' && <Button type="button" onClick={() => navigate.back()} variant={'ghost'} size={'icon'}><MoveLeftIcon /></Button>}
            <h2 className="text-black dark:text-white text-xl font-semibold">{title}</h2>
        </div>
    )
}

export default PageTitle