import { Editor } from "@tiptap/react";
import EditorAlign from "./editor-align";
import EditorBlock from "./editor-block";
import EditorMarkOne from "./editor-mark-one";
import EditorMarkSecond from "./editor-mark-second";
import EditorTextColor from "./editor-text-color";
import EditorTextTypeDropdown from "./editor-text-type-dropdown";
import EditorUndoRedo from "./editor-undo-redo";

type Props = {
    className?: string;
    editor: Editor;
    errors?: any;
};

const EditorMenu = ({ className, editor, errors }: Props) => {

    if (!editor) {
        return null
    }

    return (
        <div className={className}>
            <div className={`flex flex-col bg-white dark:bg-zinc-950 rounded-lg`}>
                <div className="overflow-x-auto flex items-center gap-1 p-2">
                    <EditorUndoRedo editor={editor} />
                    {/* <EditorVerticalLine />
                    <EditorTextColor editor={editor} /> */}
                    <EditorVerticalLine />
                    <EditorTextTypeDropdown editor={editor} />
                    <EditorVerticalLine />
                    <EditorMarkOne editor={editor} />
                    <EditorVerticalLine />
                    <EditorMarkSecond editor={editor} />
                    <EditorVerticalLine />
                    <EditorAlign editor={editor} />
                </div>
                <div className="p-2 overflow-x-auto bg-white dark:bg-zinc-950">
                    <EditorBlock editor={editor} />
                </div>
            </div>
        </div>
    )
}

export const EditorVerticalLine = () => {
    return (
        <div className='px-2 flex justify-center items-center'>
            <div className='h-6 inline-block border-s border-zinc-300 dark:border-zinc-700' />
        </div>
    )
}

export default EditorMenu;