import { ChevronDown, CircleAlert, CircleAlertIcon, ImageIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal from '../modal-custom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { deleteImage, getImage, postImage } from '@/app/api/function/image';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { FaCircleExclamation } from 'react-icons/fa6';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';

const listGrid = [
    {
        id: 1,
        value: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
        label: 'xs',
        width: 128,
        height: 128,
    },
    {
        id: 2,
        value: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        label: 'sm',
        width: 160,
        height: 160,
    },
    {
        id: 3,
        value: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        label: 'md',
        width: 192,
        height: 192,
    },
    {
        id: 4,
        value: 'grid-cols-1 sm:grid-cols-2',
        label: 'lg',
        width: 224,
        height: 224,
    },
    {
        id: 5,
        value: 'grid-cols-1',
        label: 'full',
        width: 512,
        height: 512,
    },
];

type ImageType = {
    id: string;
    url: string;
    createdAt: Date;
};

type GridType = {
    id: number,
    value: string,
    label: string,
    width: number,
    height: number,
};

type EditorBlockImageProps = {
    editor: any;
    blockType?: "insert" | "change";
    className?: string;
}

function EditorBlockImage({ editor, blockType="insert", className }: EditorBlockImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ImageType[]>([]);
    const [grid, setGrid] = useState<GridType>(listGrid[0]);
    const { toast } = useToast();
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

    const setLink = () => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        setIsOpen(false);
    };

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res:any = await getImage();
            setItems(res.data); // Sesuaikan struktur data dari API
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setShow(true);
        setIsOpen(false);
        fetchImages();
    };
    const handleClose = () => {
        setShow(false);
        setImage(null);
        setPreview(null);
    };

    const handleCancel = () => {
        setImage(null);
        setPreview(null);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Preview image sebelum upload
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    const handleUpload = async () => {
        if (!image) return;
        setLoading(true);

        try {
            const response = await postImage(image);
            if (response.data.success) {
                handleCancel();
                fetchImages();
                toast({
                    title: 'Success',
                    description: 'Image uploaded successfully',
                })
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectImage = (url: string) => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        setShow(false);
    }

    const handleDeleteImage = async (id: string) => {
        try {
            const response = await deleteImage(id); // Ganti dengan ID gambar
            console.log(response.data.message); // "Image deleted successfully"
            if (response.data.success) {
                fetchImages();
                toast({
                    title: 'Success',
                    description: 'Image deleted successfully',
                })
            }
        } catch (error: any) {
            console.error(error.response?.data || 'Error deleting image');
        }
    }

    return (
        <>
            <Button
                type="button"
                ref={refs.setReference}
                title={`${blockType === 'change' ? 'Change' : 'Insert'} Image`}
                onClick={() => setIsOpen(!isOpen)}
                variant={blockType === 'change' ? 'primary' : 'editorBlockBar'}
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
                    <Button onClick={handleOpen} type="button" variant={'editorBlockBar'} size={'sm'} className='w-full'><UploadIcon />Upload from computer</Button>
                    <div className='flex items-center gap-1 my-2 px-2'>
                        <div className='w-full border-b border-zinc-300 dark:border-zinc-800' />
                        <p className='text-center text-zinc-500 text-sm'>or</p>
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

            <Modal open={show} onClose={handleClose} title="Insert Image" description="Upload your image here" width="max-w-5xl">
                {preview ? (
                    <Image src={preview} width={1080} height={1080} alt="Preview" className="mt-4 w-full max-h-96 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg object-contain mx-auto" />
                ) : (
                    <>
                        <div {...getRootProps()} className="bg-zinc-100 dark:bg-zinc-900/25 hover:bg-zinc-200/50 hover:dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-700 hover:dark:text-zinc-300 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-800 focus:outline focus:outline-1 focus:outline-blue-500 py-20 px-8 text-center cursor-pointer transition-colors">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the file here...</p>
                            ) : (
                                <p>Drag & drop an image, or click to select</p>
                            )}
                        </div>
                        <p className='dark:text-zinc-400 text-xs p-2 mt-2'><FaCircleExclamation className='text-blue-500 inline h-4 w-4 mb-0.5 me-1.5' />Use images with an Aspect Ratio of 16:9 (for thumbails) and 4:3 (for articles)</p>
                    </>
                )}

                <div className='flex flex-wrap justify-between gap-2 items-end border-b border-zinc-300 dark:border-zinc-800 pb-3 my-4'>
                    <div className='w-full md:w-auto flex items-end gap-1'>
                        <Button
                            type='button'
                            onClick={handleUpload}
                            disabled={!image || loading}
                            variant={'primary'}
                            className='w-full md:w-auto'
                        >
                            <UploadIcon />{loading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {preview && <Button onClick={handleCancel} type="button" variant={'destructive'}><Trash2Icon />Cancel</Button>}
                    </div>

                    <div className='w-full md:w-auto flex justify-end items-center gap-2'>
                        <p className='text-sm dark:text-zinc-400'>view :</p>
                        <div className='flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 p-1'>
                            <Button onClick={() => setGrid(listGrid[0])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[0].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>xs</Button>
                            <Button onClick={() => setGrid(listGrid[1])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[1].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>sm</Button>
                            <Button onClick={() => setGrid(listGrid[2])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[2].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>md</Button>
                            <Button onClick={() => setGrid(listGrid[3])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[3].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>lg</Button>
                            <Button onClick={() => setGrid(listGrid[4])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[4].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>Full</Button>
                        </div>
                    </div>
                </div>
                <div className={`grid ${grid.value} gap-4`}>
                    {!loading ? items.length > 0 ? items.map((i, index) => (
                        <div key={index}>
                            <div className='aspect-[4/3]'>
                                <Image title={i.url} src={i.url} alt={`Image ${index}`} width={grid.width} height={grid.height} className="bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow" />
                            </div>
                            <p className='my-1.5 dark:text-zinc-400 text-xs line-clamp-2'>{i.url}</p>
                            <div className='flex items-center gap-1'>
                                <Button onClick={() => handleSelectImage(i.url)} type="button" variant={'primary'} size={'xs'}>Select</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant={'destructive'} size={'xs'}><Trash2Icon /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <div className='aspect-[4/3]'>
                                            <Image title={i.url} src={i.url} alt={`Image ${index}`} width={328} height={246} className="bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow" />
                                        </div>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone, if this image has been or is being used in a post, the image will be lost.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteImage(i.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )) : (
                        <div className='col-span-full h-36 flex justify-center items-center'>
                            <p className='text-zinc-500 text-sm'>No images uploaded</p>
                        </div>
                    ) : (
                        <>
                            <Skeleton className="aspect-[4/3]" />
                            <Skeleton className="aspect-[4/3] hidden md:block" />
                            <Skeleton className="aspect-[4/3] hidden lg:block" />
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default EditorBlockImage;
