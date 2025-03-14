import { LoaderIcon } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

function EditorLoading() {
    return (
        <div className='border border-template rounded-lg'>
            <div className='p-2 bg-zinc-100 dark:bg-zinc-950 rounded-t-lg border-b border-template'>
                <div className='flex flex-wrap items-center gap-1'>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-7' />
                        <Skeleton className='h-7 w-7' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-32' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-36' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-48' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-36' />
                    </div>
                </div>
            </div>
            <div className='p-2 bg-zinc-100 dark:bg-zinc-950 border-b border-template rounded-b-lg'>
                <div className='flex flex-wrap items-center gap-1'>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-7' />
                        <Skeleton className='h-7 w-7' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-32' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-28' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-7' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-7' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-7' />
                    </div>
                </div>
            </div>
            <div className='h-96 p-4'>
                <LoaderIcon className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />
                <span className='text-zinc-600 dark:text-zinc-500'>Loading editor...</span>
            </div>
        </div>
    )
}

export default EditorLoading