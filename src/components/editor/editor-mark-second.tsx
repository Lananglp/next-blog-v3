import { Check, CodeIcon, LinkIcon, Strikethrough, SubscriptIcon, SuperscriptIcon, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react'

function EditorMarkSecond({ editor }: { editor: any }) {

    if (!editor) {
        return null
    }

    return (
        <div className='flex items-center'>
            <Button
                type='button'
                title='strikethrough'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('strike') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <Strikethrough className='w-4 h-4' />
            </Button>
            {/* <Button
                type='button'
                title='code'
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('code') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <CodeIcon className='w-4 h-4' />
            </Button> */}
            <EditorSetLinkButton editor={editor} />
            <Button
                type='button'
                title='highlight'
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                variant={'editorToolBar'}
                size={'editorBlockBar'}
                className={editor.isActive('highlight') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                Highlight
            </Button>
            <Button
                type='button'
                title='subscript'
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('subscript') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <SubscriptIcon className='w-4 h-4' />
            </Button>
            <Button
                type='button'
                title='superscript'
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('superscript') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <SuperscriptIcon className='w-4 h-4' />
            </Button>
        </div>
    )
}

const EditorSetLinkButton = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
        if (!editor) return;
        const currentLink = editor.getAttributes("link").href || "";
        setUrl(currentLink);
    }, [editor, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const setLink = () => {
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <Button
                type='button'
                ref={refs.setReference}
                title='Set link'
                onClick={() => setIsOpen(!isOpen)}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('link') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <LinkIcon className='w-4 h-4' />
            </Button>

            {isOpen && (
                <div
                    ref={(ref) => {
                        refs.setFloating(ref);
                        dropdownRef.current = ref;
                    }}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="mt-1 w-48 lg:w-80 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md shadow-lg p-2 z-10"
                >
                    <Input
                        type="url"
                        placeholder="Enter URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        variant={'primary'}
                        onKeyDown={(e) => e.key === "Enter" && setLink()}
                    />
                    <div className="flex justify-end mt-2 space-x-1">
                        <Button type='button' variant={'editorBlockBar'} size={'editorBlockBar'} onClick={() => setIsOpen(false)}>
                            cancel
                        </Button>
                        <Button type='button' variant={'submit'} size={'editorBlockBar'} onClick={setLink}>
                            save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorMarkSecond