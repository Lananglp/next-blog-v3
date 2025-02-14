import React from 'react'
import { Input } from '../ui/input';

function EditorTextColor({ editor }: { editor: any }) {

    if (!editor) {
        return null;
    }

    return (
        <div className='flex items-center space-x-1 w-24'>
            <Input
                id='setTextColor1'
                type="color"
                onInput={e => {
                    const target = e.target as HTMLInputElement;
                    editor.chain().focus().setColor(target.value).run();
                }}
                value={editor.getAttributes('textStyle').color ? editor.getAttributes('textStyle').color : '#d4d4d8'}
                data-testid="setColor"
                className='bg-transparent border-none outline-none rounded ring-0 h-6 w-6 p-0 cursor-pointer appearance-none'
            />
            <label htmlFor='setTextColor1' className='cursor-pointer text-xs'>{editor.getAttributes('textStyle').color ? editor.getAttributes('textStyle').color : '#d4d4d8'}</label>
        </div>
    )
}

export default EditorTextColor