import { ChevronDown, CircleAlert, CircleAlertIcon, ImageIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal from '../modal-custom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { getImage } from '@/app/api/function/image';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { FaCircleExclamation } from 'react-icons/fa6';

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
    id: number;
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

function EditorBlockImage({ editor }: { editor: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ImageType[]>([]);
    const [grid, setGrid] = useState<GridType>(listGrid[0]);

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

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await axios.post('/api/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Upload success:', response.data);
            handleCancel();
            fetchImages();
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

    return (
        <div>
            <Button
                type="button"
                title="Insert image <img/>"
                onClick={() => setIsOpen(true)}
                variant={'editorBlockBar'}
                size={'editorBlockBar'}
                className={editor.isActive('image') ? 'bg-zinc-700' : 'bg-zinc-900'}
            >
                <ImageIcon />Insert Image<ChevronDown />
            </Button>

            {isOpen && (
                <div ref={dropdownRef} className="absolute mt-1 w-48 lg:w-80 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-2 z-10">
                    <Button onClick={handleOpen} type="button" variant={'primary'} size={'sm'} className='w-full'><UploadIcon />Upload from computer</Button>
                    <div className='flex items-center gap-1'>
                        <div className='w-full border-b border-zinc-700' />
                        <p className='text-center'>or</p>
                        <div className='w-full border-b border-zinc-700' />
                    </div>
                    <input
                        type="text"
                        className="w-full px-2 py-1 text-sm bg-zinc-900 text-white border border-zinc-700 rounded"
                        placeholder="Enter image URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setLink()}
                    />
                    <div className="flex justify-end mt-2 space-x-1">
                        <Button type='button' variant={'editorBlockBar'} size={'editorBlockBar'} className="bg-zinc-700 hover:bg-zinc-600" onClick={() => setIsOpen(false)}>
                            cancel
                        </Button>
                        <Button type='button' variant={'editorBlockBar'} size={'editorBlockBar'} className="bg-blue-700 hover:bg-blue-600 text-white" onClick={setLink}>
                            save
                        </Button>
                    </div>
                </div>
            )}

            <Modal open={show} onClose={handleClose} title="Insert Image" description="Upload your image here" width="max-w-5xl">
                {preview ? (
                    <Image src={preview} width={1080} height={1080} alt="Preview" className="mt-4 w-full max-h-96 bg-zinc-900/50 border border-zinc-800 rounded-lg object-contain mx-auto" />
                ) : (
                    <>
                        <div {...getRootProps()} className="bg-zinc-900/25 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 rounded-lg border-2 border-dashed border-zinc-800 hover:border-zinc-700 focus:outline focus:outline-1 focus:outline-blue-500 p-20 text-center cursor-pointer transition-colors">
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

                <div className='flex flex-wrap justify-between items-end border-b border-zinc-900 pb-3 my-4'>
                    <div className='flex items-end gap-1'>
                        <Button
                            type='button'
                            onClick={handleUpload}
                            disabled={!image || loading}
                            variant={'primary'}
                        >
                            <UploadIcon />{loading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {preview && <Button onClick={handleCancel} type="button" variant={'destructive'}><Trash2Icon />Cancel</Button>}
                    </div>

                    <div className='flex items-center gap-2'>
                        <p className='text-sm dark:text-zinc-400'>view :</p>
                        <div className='flex items-center gap-1 rounded-lg border border-zinc-900 p-1'>
                            <Button onClick={() => setGrid(listGrid[0])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[0].id ? 'bg-zinc-800' : 'hover:bg-zinc-900'} w-8 rounded h-7`}>xs</Button>
                            <Button onClick={() => setGrid(listGrid[1])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[1].id ? 'bg-zinc-800' : 'hover:bg-zinc-900'} w-8 rounded h-7`}>sm</Button>
                            <Button onClick={() => setGrid(listGrid[2])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[2].id ? 'bg-zinc-800' : 'hover:bg-zinc-900'} w-8 rounded h-7`}>md</Button>
                            <Button onClick={() => setGrid(listGrid[3])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[3].id ? 'bg-zinc-800' : 'hover:bg-zinc-900'} w-8 rounded h-7`}>lg</Button>
                            <Button onClick={() => setGrid(listGrid[4])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[4].id ? 'bg-zinc-800' : 'hover:bg-zinc-900'} w-8 rounded h-7`}>Full</Button>
                        </div>
                    </div>
                </div>
                <div className={`grid ${grid.value} gap-4`}>
                    {!loading ? items.length > 0 ? items.map((i, index) => (
                        <div key={index}>
                            <div className='aspect-[4/3]'>
                                <Image title={i.url} src={i.url} alt={`Image ${index}`} width={grid.width} height={grid.height} className="bg-zinc-900/50 border border-zinc-800 object-contain w-full h-full rounded-lg shadow" />
                            </div>
                            <p className='my-1.5 dark:text-zinc-400 text-xs line-clamp-2'>{i.url}</p>
                            <div className='flex items-center gap-1'>
                                <Button onClick={() => handleSelectImage(i.url)} type="button" variant={'primary'} size={'xs'}>Select</Button>
                                <Button onClick={() => handleSelectImage(i.url)} type="button" variant={'destructive'} size={'xs'}><Trash2Icon /></Button>
                            </div>
                        </div>
                    )) : (
                        <div className='col-span-full h-36 flex justify-center items-center'>
                            <p className='text-zinc-500 text-sm'>No images uploaded</p>
                        </div>
                    ) : (
                        <>
                            <Skeleton className="aspect-[4/3]" />
                            <Skeleton className="aspect-[4/3]" />
                            <Skeleton className="aspect-[4/3]" />
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default EditorBlockImage;
