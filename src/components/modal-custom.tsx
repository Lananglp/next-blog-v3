'use client'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom';
import { Button } from './ui/button';

interface Props {
    open: boolean;
    title?: string;
    description?: string;
    onClose?: () => void;
    width?: string;
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}

function Modal({ ref, open, title, description, onClose, width, children }: Props) {
    // Efek untuk menonaktifkan scroll saat modal terbuka
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'; // Mencegah scroll
        } else {
            document.body.style.overflow = 'auto'; // Kembalikan scroll
        }

        // Cleanup saat komponen di-unmount atau modal ditutup
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    if (!open) return null; // Jika modal tidak terbuka, jangan render apa pun

    return createPortal(
        <div ref={ref} className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-10">
            <div className={`relative w-full ${width ? width : 'max-w-2xl'} max-h-[calc(100vh-1rem)] flex flex-col px-4`}>
                <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl border dark:border-zinc-800 flex flex-col overflow-auto">
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
        </div>,
        document.body // Portal ke body agar modal tampil penuh di layar
    );
}

export default Modal;
