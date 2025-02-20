import React, { useCallback, useState } from 'react'
import { Button } from '../ui/button'
import { ImageType } from '@/types/image-type';
import { useToast } from '@/hooks/use-toast';
import { deleteImage, getImage, postImage } from '@/app/api/function/image';
import { CropIcon, RedoIcon, RotateCcw, SaveIcon, Trash2Icon, UndoIcon, UploadIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Modal from '../modal-custom';
import Image from 'next/image';
import InputFile from '../input/input-file';
import { FaCircleExclamation } from 'react-icons/fa6';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Skeleton } from '../ui/skeleton';
import Cropper from 'react-easy-crop';
import { Slider } from '../ui/slider';
import { getCroppedImg } from '@/utils/cropImage';
import { Label } from '../ui/label';
import { MdCropRotate } from "react-icons/md";

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

type GridType = {
    id: number,
    value: string,
    label: string,
    width: number,
    height: number,
};

type CroppedAreaPixelsType = {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Flip {
    horizontal: boolean;
    vertical: boolean;
}

type Props = {
    ref?: React.RefObject<any>;
    onSelect?: (url: string) => void;
    onClose?: () => void;
}

function StorageImage({ ref, onSelect, onClose }: Props) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ImageType[]>([]);
    const [grid, setGrid] = useState<GridType>(listGrid[0]);
    const { toast } = useToast();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Preview image sebelum upload
            setIsEdit(false);
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });
    // Cropper states
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [aspect, setAspect] = useState<number>(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixelsType | null>(null);
    const [flip, setFlip] = useState<Flip>({ horizontal: false, vertical: false });

    const handleOpen = () => {
        setOpenModal(true);
        fetchImages();
    };
    const handleClose = () => {
        setOpenModal(false);
        setImage(null);
        setPreview(null);
        handleResetCrop();
        if (onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        setImage(null);
        setPreview(null);
    };

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res: any = await getImage();
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!image) return;
        setLoading(true);

        try {

            let fileToUpload: File | null = null;

            if (isEdit && preview) {
                // Convert preview (blob URL) to File
                const response = await fetch(preview);
                const blob = await response.blob();
                fileToUpload = new File([blob], "cropped-image.png", { type: "image/png" });
            } else if (image) {
                fileToUpload = image;
            }

            if (!fileToUpload) {
                throw new Error("No image to upload");
            }

            const response = await postImage(fileToUpload);
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
        if (onSelect) {
            onSelect(url);
        }
        setOpenModal(false);
    }

    const handleDeleteImage = async (id: string) => {
        try {
            const response = await deleteImage(id);
            console.log(response.data.message);
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

    const handleResetCrop = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setAspect(16 / 9);
        setCroppedAreaPixels(null);
        setFlip({ horizontal: false, vertical: false });
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: CroppedAreaPixelsType) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleAspectChange = (ratio: number) => {
        setAspect(ratio);
    };

    // Fungsi untuk menyimpan hasil crop sebelum upload
    const handleSaveCrop = async () => {
        if (!preview || !croppedAreaPixels) return;

        try {
            // Panggil getCroppedImg untuk mendapatkan gambar yang dipotong dan diputar
            const croppedImageUrl = await getCroppedImg(
                preview, // URL gambar yang akan dipotong
                croppedAreaPixels, // Area crop (dalam pixel)
                rotation, // Rotasi yang diterapkan pada gambar
                flip // Flip gambar, jika ada
            );

            // Update preview dengan gambar yang dipotong dan diputar
            setPreview(croppedImageUrl);

            // Menyembunyikan cropper setelah gambar berhasil disimpan
            setShowCropper(false);
            handleResetCrop();
            setIsEdit(true);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    const handleRotate = (direction: 'left' | 'right') => {
        setRotation((prevRotation) => {
            let newRotation = direction === 'left' ? prevRotation - 90 : prevRotation + 90;

            // Jika melebihi batas, sesuaikan dengan -180 atau 180
            if (newRotation < -180) newRotation = 90;
            if (newRotation > 180) newRotation = -90;

            return newRotation;
        });
    };    

    const handleFlipHorizontal = () => {
        setFlip((prevFlip) => ({
            horizontal: !prevFlip.horizontal,
            vertical: prevFlip.vertical,
        }));
    };

    const handleFlipVertical = () => {
        setFlip((prevFlip) => ({
            horizontal: prevFlip.horizontal,
            vertical: !prevFlip.vertical,
        }));
    };

    const handleDrag = (dx: number, dy: number) => {
        setCrop(prev => ({
            x: prev.x + (flip.horizontal ? -dx : dx),
            y: prev.y + (flip.vertical ? -dy : dy),
        }));
    };

    return (
        <div ref={ref} className='flex-1'>
            <Button onClick={handleOpen} type="button" variant={'editorBlockBar'} size={'sm'} className='w-full'><UploadIcon />Upload from computer</Button>

            <Modal ref={ref} open={openModal} onClose={handleClose} title="Insert Image" description="Upload your image here" width="max-w-5xl">
                {preview ?
                    !showCropper ? (
                        <Image unoptimized src={preview} width={1080} height={1080} alt="Preview" className="w-full h-[50vh] bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg object-contain mx-auto" />
                    ) : (
                        <div>
                            <div className='relative w-full h-[50vh] bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800'>
                                <Cropper
                                    image={preview}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    // style={{
                                    //     containerStyle: {
                                    //         transform: `scaleX(${flip.horizontal ? -1 : 1}) scaleY(${flip.vertical ? -1 : 1})`,
                                    //     }
                                    // }}
                                />
                            </div>
                            <p className='text-xs text-zinc-500 mt-2'>Use the cursor to adjust the crop area. Scroll the mouse to zoom in or out, and drag the image as needed.</p>
                            <div className='flex flex-wrap md:flex-nowrap justify-center items-center gap-2 mt-4'>
                                <div className='w-full flex items-center gap-2'>
                                    <Label className='inline-block text-nowrap'>Zoom :</Label>
                                    <div className='w-full'>
                                        <Slider
                                            value={[zoom]}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            onValueChange={(value) => setZoom(value[0])}
                                        />
                                    </div>
                                    <p className='text-sm'>{zoom.toFixed(1)}</p>
                                    <Button type='button' onClick={() => setZoom(1)} variant={'editorBlockBar'} size={'sm'} className='md:h-8 md:w-8'><RotateCcw /></Button>
                                </div>
                                <div className='w-full flex items-center gap-2'>
                                    <Label className='inline-block text-nowrap'>Rotate :</Label>
                                    <div className='w-full'>
                                        <Slider
                                            value={[rotation]}
                                            onValueChange={(value) => setRotation(value[0])}
                                            min={-180}
                                            max={180}
                                            step={1}
                                        />
                                    </div>
                                    <p className='text-sm'>{rotation}<sup>o</sup></p>
                                    <Button type='button' onClick={() => setRotation(0)} variant={'editorBlockBar'} size={'sm'} className='md:h-8 md:w-8'><RotateCcw /></Button>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-2 border-b border-zinc-800 pb-4 mt-4'>
                                <div className='flex items-center gap-1'>
                                    <Button type='button' onClick={handleSaveCrop} variant={'primary'} size={'sm'}><SaveIcon />Saved Change</Button>
                                    <Button type='button' onClick={() => { setShowCropper(false); handleResetCrop(); }} variant={'editorBlockBar'} size={'sm'}>Cancel</Button>
                                </div>
                                <div className='w-full md:w-auto flex md:justify-center items-center gap-2 md:gap-1'>
                                    <Button type='button' onClick={() => handleAspectChange(16 / 9)} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-10'>16:9</Button>
                                    <Button type='button' onClick={() => handleAspectChange(4 / 3)} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-10'>4:3</Button>
                                    <Button type='button' onClick={() => handleAspectChange(1 / 1)} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-10'>1:1</Button>
                                </div>
                                <div className='w-full md:w-auto md:justify-end flex items-center gap-1'>
                                    <Button type='button' onClick={() => handleRotate('left')} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-8 h-8'><MdCropRotate /></Button>
                                    {/* <Button type='button' onClick={() => handleFlipHorizontal()} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-20'><UndoIcon />Flip X</Button>
                                    <Button type='button' onClick={() => handleFlipVertical()} variant={'editorBlockBar'} size={'sm'} className='w-full md:w-20'>Flip Y<RedoIcon /></Button> */}
                                </div>
                            </div>
                        </div>
                ) : (
                    <>
                        <InputFile
                            getRootProps={getRootProps}
                            getInputProps={getInputProps}
                            isDragActive={isDragActive}
                            placeholder="Drag & drop an image, or click to select"
                        />
                        <p className='dark:text-zinc-400 text-xs p-2 mt-2'><FaCircleExclamation className='text-blue-500 inline h-4 w-4 mb-0.5 me-1.5' />Use images with an Aspect Ratio of 16:9 (for thumbails) and 4:3 (for articles)</p>
                    </>
                )}

                <div className='flex flex-wrap justify-between gap-2 items-end border-b border-zinc-300 dark:border-zinc-800 pb-3 my-4'>
                    <div className='w-full md:w-auto flex items-end gap-1'>
                        <Button
                            title='Upload Image'
                            type='button'
                            onClick={handleUpload}
                            disabled={!image || loading || showCropper}
                            variant={'primary'}
                            size={'sm'}
                            className='w-full md:w-auto'
                        >
                            <UploadIcon />{loading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {preview && <Button type="button" title='Cancel' onClick={handleCancel} disabled={loading || showCropper} variant={'destructive'} className='h-8 w-8'><Trash2Icon /></Button>}
                        {preview && <Button type='button' title='Crop Image' onClick={() => setShowCropper(true)} disabled={loading || showCropper} variant={'editorBlockBar'} className='h-8 w-8'><CropIcon /></Button>}
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
        </div>
    )
}

export default StorageImage