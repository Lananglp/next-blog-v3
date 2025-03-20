import { useState, useRef, useEffect } from "react";
import { Grid2X2, ChevronDown, PlusIcon, WandSparkles, Trash2, MoveLeft, MoveRight, MoveUp, MoveDown, Square, Scissors, AlignCenterHorizontal, Columns2, Rows2, TableCellsMerge } from "lucide-react";
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Editor } from '@tiptap/react'

const EditorBlockTable = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { label: "Fix Tables", type: 'option', icon: <WandSparkles className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().fixTables().run() },
        { label: "Delete Table", type: 'delete', icon: <Trash2 className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().deleteTable().run() },
        { label: "Add Column Before", type: 'option', icon: <MoveLeft className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().addColumnBefore().run() },
        { label: "Add Column After", type: 'option', icon: <MoveRight className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().addColumnAfter().run() },
        { label: "Delete Column", type: 'delete', icon: <Trash2 className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().deleteColumn().run() },
        { label: "Add Row Before", type: 'option', icon: <MoveUp className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().addRowBefore().run() },
        { label: "Add Row After", type: 'option', icon: <MoveDown className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().addRowAfter().run() },
        { label: "Delete Row", type: 'delete', icon: <Trash2 className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().deleteRow().run() },
        { label: "Merge Cells", type: 'option', icon: <Square className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().mergeCells().run() },
        { label: "Split Cell", type: 'option', icon: <Scissors className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().splitCell().run() },
        { label: "Merge or Split", type: 'option', icon: <AlignCenterHorizontal className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().mergeOrSplit().run() },
        { label: "Toggle Header Column", type: 'option', icon: <Columns2 className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().toggleHeaderColumn().run() },
        { label: "Toggle Header Row", type: 'option', icon: <Rows2 className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().toggleHeaderRow().run() },
        { label: "Toggle Header Cell", type: 'option', icon: <TableCellsMerge className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().toggleHeaderCell().run() },
        { label: "Set Cell Attribute", type: 'option', icon: <PlusIcon className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().setCellAttribute('colspan', 2).run() },
        { label: "Go to Previous Cell", type: 'option', icon: <PiArrowBendUpLeftBold className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().goToPreviousCell().run() },
        { label: "Go to Next Cell", type: 'option', icon: <PiArrowBendUpRightBold className="w-4 h-4 mb-0.5" />, action: () => editor.chain().focus().goToNextCell().run() },
    ];

    return (
        <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    title="Table Options"
                    variant={'editorBlockBar'}
                    size={'editorBlockBar'}
                    className={editor.isActive('table') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
                >
                    <Grid2X2 />Table<ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80 lg:w-[40rem]'>
                <DropdownMenuLabel>Insert Table</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-2">
                    <Button
                        type="button"
                        variant={'editorBlockBar'}
                        size={'xs'}
                        onClick={() => {
                            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                            setIsOpen(false);
                        }}
                        disabled={editor.isActive('table')}
                        className="bg-zinc-200/50 dark:bg-zinc-900 justify-start"
                    >
                        <PlusIcon className="w-4 h-4 mb-0.5" />Insert Table
                    </Button>
                    {options.map((option, index) => (
                        <Button
                            type="button"
                            key={option.label}
                            variant={'editorBlockBar'}
                            size={'xs'}
                            className={`${option.type === 'delete' && 'text-red-500'} justify-start`}
                            onClick={() => {
                                option.action();
                                setIsOpen(false);
                            }}
                            disabled={!editor.isActive('table')}
                        >
                            {option.icon}{option.label}
                        </Button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EditorBlockTable;
