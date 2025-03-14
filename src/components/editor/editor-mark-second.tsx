import { Check, CodeIcon, LinkIcon, Strikethrough, SubscriptIcon, SuperscriptIcon, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Editor } from '@tiptap/react'

function EditorMarkSecond({ editor }: { editor: Editor }) {

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
            <Button
                type='button'
                title='code'
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('code') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
            >
                <CodeIcon className='w-4 h-4' />
            </Button>
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

    useEffect(() => {
        if (!editor) return;
        const currentLink = editor.getAttributes("link").href || "";
        setUrl(currentLink);
    }, [editor, isOpen]);

    const setLink = () => {
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setIsOpen(false);
    };

    return (
        <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type='button'
                    title='Set link'
                    variant={'editorToolBar'}
                    size={'editorToolBar'}
                    className={editor.isActive('link') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}
                >
                    <LinkIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80'>
                <DropdownMenuLabel>Set link</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className='p-2'>
                    <Input
                        type="url"
                        placeholder="Enter URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        variant={'primary'}
                        onKeyDown={(e) => e.key === "Enter" && setLink()}
                    />
                    <div className="flex justify-end mt-2 space-x-1">
                        <Button type='button' variant={'editorBlockBar'} size={'sm'} onClick={() => setIsOpen(false)}>cancel</Button>
                        <Button type='button' variant={'submit'} size={'sm'} onClick={setLink}>save</Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EditorMarkSecond