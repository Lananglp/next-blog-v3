import { useState, useRef, useEffect } from "react";
import { Grid2X2, ChevronDown, PlusIcon, WandSparkles, Trash2, MoveLeft, MoveRight, MoveUp, MoveDown, Square, Scissors, AlignCenterHorizontal, Columns2, Rows2, TableCellsMerge } from "lucide-react";
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";

const EditorBlockTable = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

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
        <div className="relative inline-block">
            <Button
                type="button"
                ref={refs.setReference}
                title="Table Options"
                onClick={() => setIsOpen(!isOpen)}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('table') ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900'}
            >
                <Grid2X2 />Table<ChevronDown />
            </Button>

            {isOpen && (
                <div
                    ref={(ref) => {
                        refs.setFloating(ref);
                        dropdownRef.current = ref;
                    }}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="absolute mt-1 w-96 lg:w-[40rem] grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-10 p-1.5"
                >
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
            )}
        </div>
    );
};

export default EditorBlockTable;
