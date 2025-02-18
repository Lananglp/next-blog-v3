import { ChevronDown, ImageIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import StorageImage from '../storage/storage-image';

type EditorBlockImageProps = {
    editor: any;
    blockType?: "insert" | "change";
    className?: string;
}

function EditorBlockImage({ editor, blockType="insert", className }: EditorBlockImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const storageImageRef = useRef<HTMLDivElement>(null);
    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
        if (!editor) return;

        const updateImageUrl = () => {
            const { node } = editor.view.state.selection;
            if (node?.type.name === "image") {
                setUrl(node.attrs.src || ""); // Ambil URL gambar jika ada
            } else {
                setUrl(""); // Reset jika bukan gambar
            }
        };

        editor.on("selectionUpdate", updateImageUrl);
        return () => {
            editor.off("selectionUpdate", updateImageUrl);
        };
    }, [editor]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && storageImageRef.current && !storageImageRef.current?.contains(event.target as Node)) {
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

    const setLink = () => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        setIsOpen(false);
    };

    const handleSelectImage = (url: string) => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }

    return (
        <>
            <Button
                type="button"
                ref={refs.setReference}
                title={`${blockType === 'change' ? 'Change' : 'Insert'} Image`}
                onClick={() => setIsOpen(!isOpen)}
                variant={blockType === 'change' ? 'outline' : 'editorBlockBar'}
                size={blockType === 'change' ? 'xs' : 'editorBlockBar'}
                className={`${editor.isActive('image') ? blockType === 'change' ? '' : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : blockType === 'change' ? '' : 'bg-zinc-100 dark:bg-zinc-900'} ${className}`}
            >
                <ImageIcon />{blockType === 'change' ? 'Change this' : 'Insert'} Image<ChevronDown />
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
                    className="absolute mt-1 w-48 lg:w-80 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md shadow-lg p-2 z-10"
                >
                    <StorageImage ref={storageImageRef} onSelect={(url) => handleSelectImage(url)} />
                    <div className='flex items-center gap-1 my-2 px-2'>
                        <div className='w-full border-b border-zinc-300 dark:border-zinc-800' />
                        <div className='text-center text-zinc-500 text-sm'>or</div>
                        <div className='w-full border-b border-zinc-300 dark:border-zinc-800' />
                    </div>
                    <Input
                        type="url"
                        variant={'primary'}
                        placeholder="Enter image URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setLink()}
                    />
                    <div className="flex justify-end mt-2 space-x-1">
                        <Button type='button' variant={'editorBlockBar'} size={'editorBlockBar'} onClick={() => setIsOpen(false)}>
                            cancel
                        </Button>
                        <Button type='button' variant={'submit'} size={'editorBlockBar'} onClick={setLink}>
                            save
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditorBlockImage;
