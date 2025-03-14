import React from 'react'
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi'
import { Button } from '../ui/button'
import { Editor } from '@tiptap/react'

function EditorUndoRedo({ editor }: { editor: Editor }) {

    if (!editor) {
        return null
    }

    return (
        <div className='flex'>
            <Button
                type='button'
                title='undo'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
            >
                <PiArrowBendUpLeftBold className='w-4 h-4' />
            </Button>
            <Button
                type='button'
                title='redo'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                variant={'editorToolBar'}
                size={'editorToolBar'}
            >
                <PiArrowBendUpRightBold className='w-4 h-4' />
            </Button>
        </div>
    )
}

export default EditorUndoRedo