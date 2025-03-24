'use client'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button';
import { MoveLeftIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux';

function PageTitle({ className }: { className?: string }) {

    const { title } = useSelector((state: RootState) => state.pageTitle);
    const pathname = usePathname();
    const navigate = useRouter();

    return (
        <div className={`flex items-center gap-2 mb-4 ${className}`}>
            {pathname !== '/admin' && <Button type="button" onClick={() => navigate.back()} variant={'ghost'} size={'icon'}><MoveLeftIcon /></Button>}
            <h2 className="line-clamp-1 text-black dark:text-white text-base md:text-lg lg:text-xl font-semibold">{title}</h2>
        </div>
    )
}

export default PageTitle