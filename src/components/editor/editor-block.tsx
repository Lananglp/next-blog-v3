import { Code, CornerDownLeft, Grid2X2, ImageIcon, ListIcon, ListOrderedIcon, PlusIcon, Quote } from 'lucide-react';
import React from 'react'
import EditorBlockTable from './editor-block-table';
import EditorBlockImage from './editor-block-image';
import { Button } from '../ui/button';

function EditorBlock({ editor }: { editor: any }) {

    const showLabel = false;

    if (!editor) {
        return null;
    }

    return (
        <div className='flex flex-wrap items-center gap-1'>
            <Button
                type='button'
                title='Horizontal rule <hr/>'
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('horizontalRule') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                {/* <CornerDownLeft className='inline w-5 h-5 mb-0.5 me-1' /> */}
                {showLabel ? 'Break line' : 'HR'}
            </Button>
            <EditorBlockImage editor={editor} />
            <EditorBlockTable editor={editor} />
            <Button
                type='button'
                title='dot list'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                <ListIcon />{showLabel && 'Dot List'}
            </Button>
            <Button
                type='button'
                title='number list'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                <ListOrderedIcon />{showLabel && 'Number List'}
            </Button>
            <Button
                type='button'
                title='Code Block'
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('codeBlock') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                <Code />Code Block
            </Button>
            <Button
                type='button'
                title='Blockquote'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('blockquote') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                <Quote />{showLabel && 'Blockquote'}
            </Button>
        </div>
    )
}

export default EditorBlock