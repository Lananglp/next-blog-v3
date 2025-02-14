'use client'
import React, { useEffect } from 'react'
import { Button } from './ui/button';
import './css/modal-custom.css'

interface Props {
    open: boolean;
    title?: string;
    description?: string;
    onClose?: () => void;
    width?: string;
    children: React.ReactNode;
}

function Modal({ open, title, description, onClose, width, children }: Props) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [open]);

    return (
        <div tabIndex={-1} aria-hidden="true" className={`${open ? 'flex' : 'hidden'} bg-black/50 backdrop-blur-sm fixed z-50 justify-center items-center w-full inset-0 max-h-full`}>
            <div className={`relative w-full ${width ? width : 'max-w-2xl'} max-h-[calc(100vh-2rem)] flex flex-col`}>
                <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl border dark:border-zinc-900 flex flex-col overflow-auto">
                    {(title || description) &&
                        <div className="flex items-center justify-between px-4 py-2 border-b rounded-t dark:border-zinc-800">
                            <div>
                                <h6 className="font-medium text-zinc-900 dark:text-zinc-300">{title}</h6>
                                {description && <p className="text-zinc-600 dark:text-zinc-400 text-sm">{description}</p>}
                            </div>
                            {onClose &&
                                <Button onClick={onClose} type="button" variant={'ghost'} size={'icon'} className="dark:text-zinc-400">
                                    <svg className="p-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </Button>
                            }
                        </div>
                    }
                    <div className="p-4 text-zinc-600 dark:text-zinc-300 text-wrap overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal