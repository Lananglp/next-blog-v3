import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "../ui/button";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";

type OptionType = {
    label: string;
    type: string;
    level?: number;
};

const EditorTextTypeDropdown = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const options = [
        { label: "Text", type: "paragraph" },
        { label: "Heading 1", type: "heading", level: 2 },
        { label: "Heading 2", type: "heading", level: 3 },
        { label: "Heading 3", type: "heading", level: 4 },
    ];
    const [selected, setSelected] = useState<string>("Text");
    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });
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
            <Button
                ref={refs.setReference}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                variant={'editorToolBar'}
                size={'editorBlockBar'}
                className="text-sm w-28 flex justify-between items-center"
            >
                <span>{selected}</span><ChevronDown />
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
                    className="mt-1 w-36 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md z-10"
                >
                    {options.map((option) => (
                        <button
                            key={option.label}
                            className={`${selected === option.label ? "bg-zinc-200 dark:bg-zinc-700" : ""} w-full text-left px-3 py-1 text-sm hover:bg-zinc-200 hover:dark:bg-zinc-700 flex justify-between`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                            {selected === option.label && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditorTextTypeDropdown;