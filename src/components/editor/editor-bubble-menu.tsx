import { BubbleMenu } from '@tiptap/react'
import React from 'react'
import EditorUndoRedo from './editor-undo-redo'
import { EditorVerticalLine } from './editor-menu'
import EditorTextColor from './editor-text-color'
import EditorTextTypeDropdown from './editor-text-type-dropdown'
import EditorMarkOne from './editor-mark-one'
import EditorMarkSecond from './editor-mark-second'
import EditorAlign from './editor-align'

function EditorBubbleMenu({ editor }: { editor: any }) {

    if (!editor) {
        return null
    }

    return (
        <BubbleMenu
            shouldShow={({ editor }) => {
                return editor.state.selection.empty === false && !editor.isActive("image");
            }}
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "bottom-start", // Menampilkan menu di bawah kursor
                offset: [0, 8], // [horizontal, vertical] -> Geser ke bawah 10px
            }}
            className='bg-zinc-950 border border-zinc-900 rounded-lg p-2'
        >
            <div className="flex flex-wrap items-center gap-1">
                {/* <EditorTextColor editor={editor} />
                <EditorVerticalLine /> */}
                <EditorTextTypeDropdown editor={editor} />
                <EditorVerticalLine />
                <EditorMarkOne editor={editor} />
                <EditorVerticalLine />
                <EditorMarkSecond editor={editor} />
                <EditorVerticalLine />
                <EditorAlign editor={editor} />
            </div>
        </BubbleMenu>
    )
}

export default EditorBubbleMenu