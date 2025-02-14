import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

function EditorMarkOne({ editor }: { editor: any }) {

    if (!editor) {
        return null
    }

    return (
        <div className='flex items-center'>
            <Button
                type='button'
                title='bold'
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('bold') ? 'bg-zinc-700' : ''}
            >
                <BoldIcon className='w-4 h-4' />
            </Button>
            <Button
                type='button'
                title='italic'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('italic') ? 'bg-zinc-700' : ''}
            >
                <ItalicIcon className='w-4 h-4' />
            </Button>
            <Button
                type='button'
                title='underline'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
                className={editor.isActive('underline') ? 'bg-zinc-700' : ''}
            >
                <UnderlineIcon className='w-4 h-4' />
            </Button>
        </div>
    )
}

export default EditorMarkOne