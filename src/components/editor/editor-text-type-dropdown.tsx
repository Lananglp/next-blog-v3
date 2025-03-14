import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "../ui/button";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { Editor } from '@tiptap/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

type OptionType = {
    label: string;
    type: string;
    level?: number;
};

const EditorTextTypeDropdown = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const options = [
        { label: "Text", type: "paragraph" },
        { label: "Heading 1", type: "heading", level: 2 },
        { label: "Heading 2", type: "heading", level: 3 },
        { label: "Heading 3", type: "heading", level: 4 },
    ];
    const [selected, setSelected] = useState<string>("Text");
    const { state } = editor

    useEffect(() => {
        if (!editor && !state) return;

        if (editor.isActive("paragraph")) {
            setSelected("Text");
        } else if (editor.isActive("heading", { level: 2 })) {
            setSelected("Heading 1");
        } else if (editor.isActive("heading", { level: 3 })) {
            setSelected("Heading 2");
        } else if (editor.isActive("heading", { level: 4 })) {
            setSelected("Heading 3");
        }
    }, [editor, state]);

    const handleSelect = (option: any) => {
        setIsOpen(false);

        if (option.type === "paragraph") {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level: option.level }).run();
        }
    };

    return (
        <div className="relative inline-block">
            <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant={'editorToolBar'}
                        size={'editorBlockBar'}
                        className="text-sm w-28 flex justify-between items-center"
                    >
                        {selected}<ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-36'>
                    <DropdownMenuLabel>Set link</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="space-y-1">
                        {options.map((option) => (
                            <Button
                                key={option.label}
                                variant={'ghost'}
                                className={`w-full h-7 justify-start ${selected === option.label ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                                {selected === option.label && <Check className="w-4 h-4" />}
                            </Button>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default EditorTextTypeDropdown;