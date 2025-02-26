'use client'
import React, { useEffect, useId } from 'react'
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { useLockBodyScroll, useToggle } from 'react-use';
import { AnimatePresence, motion } from "motion/react"

interface Props {
    open: boolean;
    title?: string;
    description?: string;
    onClose?: () => void;
    width?: string;
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    enableTransition?: boolean;
}

function Modal({ ref, open, title, description, onClose, width, children, enableTransition=false }: Props) {
    const [on, toggle] = useToggle(false);
    const randomId = useId();
    const motionConfigOne = {
        visible: { opacity: 1, transition: { duration: 0.2 } },
        hidden: { opacity: 0, transition: { duration: 0.2 } },
    }
    const motionConfigTwo = {
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2, scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 }, when: "beforeChildren" } },
        hidden: { opacity: 0, scale: 0.7, transition: { duration: 0.2, scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 }, when: "afterChildren" } },
    }

    useLockBodyScroll(on);

    useEffect(() => {
        if (open) {
            toggle(true);
        } else {
            toggle(false);
        }

        return () => toggle(false);
    }, [open]);

    if (!open) return null;

    return createPortal(
        <motion.div
            ref={ref}
            key={randomId}
            initial={enableTransition && motionConfigOne.hidden}
            animate={enableTransition && motionConfigOne.visible}
            exit={enableTransition ? motionConfigOne.hidden : undefined}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-10"
        >
            <motion.div
                key={randomId}
                initial={enableTransition && motionConfigTwo.hidden}
                animate={enableTransition && motionConfigTwo.visible}
                exit={enableTransition ? motionConfigTwo.hidden : undefined}
                className={`relative w-full ${width ? width : 'max-w-2xl'} max-h-[calc(100vh-1rem)] flex flex-col px-4`}
            >
                <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl border dark:border-zinc-800 flex flex-col overflow-auto">
                    {(title || description) &&
                        <div className="flex items-center justify-between px-4 py-2.5 border-b rounded-t dark:border-zinc-800">
                            <div className='pe-6'>
                                <h6 className="mb-1 text-lg font-medium text-black dark:text-white">{title}</h6>
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
            </motion.div>
        </motion.div>,
        document.body
    );
}

export default Modal;
