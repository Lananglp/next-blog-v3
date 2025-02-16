import React from 'react'
import EditorBlock from './editor-block'
import { FloatingMenu } from '@tiptap/react'

function EditorFloatingMenu({ editor }: { editor: any }) {

    if (!editor) {
        return null
    }

    return (
        <FloatingMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "bottom-start", // Menampilkan menu di bawah kursor
                offset: [0, 8], // [horizontal, vertical] -> Geser ke bawah 10px
                zIndex: 0
            }}
            className='w-64 md:w-96 lg:w-[32rem]'
        >
            {/* <div className='mb-1 text-sm text-zinc-500'>Select a block</div> */}
            <EditorBlock editor={editor} />
        </FloatingMenu>
    )
}

export default EditorFloatingMenu