import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button';

function EditorAlign({ editor }: { editor: any }) {

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1">
            <Button
                type='button'
                title='align left'
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive({ textAlign: 'left' }) ? 'bg-zinc-700' : ''}
            >
                <AlignLeft />
            </Button>
            <Button
                type='button'
                title='align center'
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive({ textAlign: 'center' }) ? 'bg-zinc-700' : ''}
            >
                <AlignCenter />
            </Button>
            <Button
                type='button'
                title='align right'
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive({ textAlign: 'right' }) ? 'bg-zinc-700' : ''}
            >
                <AlignRight />
            </Button>
            <Button
                type='button'
                title='align justify'
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive({ textAlign: 'justify' }) ? 'bg-zinc-700' : ''}
            >
                <AlignJustify />
            </Button>
        </div>
    )
}

export default EditorAlign