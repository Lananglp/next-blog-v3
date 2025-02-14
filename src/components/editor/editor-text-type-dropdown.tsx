import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "../ui/button";

const EditorTextTypeDropdown = ({ editor }: { editor: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Heading 1");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { label: "Paragraph", type: "paragraph" },
        { label: "Heading 1", type: "heading", level: 1 },
        { label: "Heading 2", type: "heading", level: 2 },
        { label: "Heading 3", type: "heading", level: 3 },
        { label: "Heading 4", type: "heading", level: 4 },
        { label: "Heading 5", type: "heading", level: 5 },
        { label: "Heading 6", type: "heading", level: 6 },
    ];

    useEffect(() => {
        if (!editor) return;

        if (editor.isActive("paragraph")) {
            setSelected("Paragraph");
        } else if (editor.isActive("heading", { level: 1 })) {
            setSelected("Heading 1");
        } else if (editor.isActive("heading", { level: 2 })) {
            setSelected("Heading 2");
        } else if (editor.isActive("heading", { level: 3 })) {
            setSelected("Heading 3");
        } else if (editor.isActive("heading", { level: 4 })) {
            setSelected("Heading 4");
        } else if (editor.isActive("heading", { level: 5 })) {
            setSelected("Heading 5");
        } else if (editor.isActive("heading", { level: 6 })) {
            setSelected("Heading 6");
        }
    }, [editor]);

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
        <div ref={dropdownRef} className="relative inline-block">
            <Button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                variant={'editorToolBar'}
                size={'editorBlockBar'}
                className="text-sm w-28 flex justify-between items-center"
            >
                <span>{selected}</span><ChevronDown />
            </Button>

            {isOpen && (
                <div className="absolute mt-1 w-36 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10">
                    {options.map((option) => (
                        <button
                            key={option.label}
                            className={`${selected === option.label ? "bg-zinc-700" : ""} w-full text-left px-3 py-1 text-sm hover:bg-zinc-600 flex justify-between`}
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