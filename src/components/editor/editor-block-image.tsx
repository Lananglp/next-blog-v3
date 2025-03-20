import { ChevronDown, ImageIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import StorageImage from '../storage/storage-image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';

type EditorBlockImageProps = {
    editor: Editor;
    blockType?: "insert" | "change";
    className?: string;
    onOpenModalChange?: (value: boolean) => void;
}

function EditorBlockImage({ editor, blockType="insert", className, onOpenModalChange }: EditorBlockImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!editor) return;

        const updateImageUrl = () => {
            const { selection } = editor.state;
            const node = selection instanceof NodeSelection ? selection.node : null;

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

    const handleClose = () => {
        setIsOpen(false);
        if (onOpenModalChange) {
            onOpenModalChange(false);
        }
    }

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
        setIsOpen(false);
        if (onOpenModalChange) {
            onOpenModalChange(false);
        }
    }

    return (
        <>
            <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        title={`${blockType === 'change' ? 'Change' : editor.isActive('image') ? 'Change' : 'Insert'} Image`}
                        variant={blockType === 'change' ? 'outline' : 'editorBlockBar'}
                        size={blockType === 'change' ? 'xs' : 'editorBlockBar'}
                        className={`${editor.isActive('image') ? blockType === 'change' ? '' : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' : blockType === 'change' ? '' : 'bg-zinc-100 dark:bg-zinc-900'} ${className}`}
                    >
                        <ImageIcon />{blockType === 'change' ? 'Change this' : editor.isActive('image') ? 'Change' : 'Insert'} Image<ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent className='w-48 lg:w-80'> */}
                <DropdownMenuContent className='w-80'>
                    <DropdownMenuLabel>Insert Image</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className='p-2'>
                        <StorageImage value={url} onSelect={(url) => handleSelectImage(url)} onClose={handleClose} />
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
                            <Button type='button' variant={'editorBlockBar'} size={'sm'} onClick={handleClose}>
                                cancel
                            </Button>
                            <Button type='button' variant={'submit'} size={'sm'} onClick={setLink}>
                                save
                            </Button>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default EditorBlockImage;
