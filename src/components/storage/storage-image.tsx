import React, { ForwardedRef, useCallback, useState } from 'react'
import { Button } from '../ui/button'
import { ImageType, initialImage } from '@/types/image-type';
import { useToast } from '@/hooks/use-toast';
import { deleteImage, getImage, postImage } from '@/app/api/function/image';
import { CropIcon, ImageOffIcon, LoaderIcon, RedoIcon, RotateCcw, SaveIcon, Trash2Icon, UndoIcon, UploadIcon, XIcon } from 'lucide-react';
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
import { generateUniqueUrl, validateImageURL } from '@/helper/helper';
import ImagePreview from './image-preview';
import { Input } from '../ui/input';

type SourceType = {
    storage: boolean;
    url: boolean;
}

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
    value?: string;
    onOpen?: () => void;
    onSelect?: (url: string) => void;
    onClose?: () => void;
    onOpenModalChange?: (value: boolean) => void;
}

function StorageImage({ ref, value, onSelect, onClose, onOpen, onOpenModalChange }: Props) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [imgSource, setImgSource] = useState<SourceType>({
        storage: true,
        url: false
    });
    const [url, setUrl] = useState<string>(value || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ImageType[]>([]);
    const [detail, setDetail] = useState<ImageType>({
        id: '',
        url: '',
        createdAt: null,
    });
    const { toast } = useToast();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
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
    // console.log(value);
    
    const handleOpen = () => {
        setOpenModal(true);
        fetchImages();
        if (onOpen) {
            onOpen();
        }
        if (onOpenModalChange) {
            onOpenModalChange(true);
        }
    };
    const handleClose = () => {
        setOpenModal(false);
        setImage(null);
        setPreview(null);
        setDetail(initialImage);
        handleResetCrop();
        if (onClose) {
            onClose();
        }
        if (onOpenModalChange) {
            onOpenModalChange(false);
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
        if (onOpenModalChange) {
            onOpenModalChange(false);
        }
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
                        <Image priority unoptimized src={preview} width={1080} height={1080} alt="Preview" className="w-full h-[50vh] bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg object-contain mx-auto" />
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
                ) : detail.id ? (
                    <ImagePreview isDelete={isDelete} detail={detail} alt='preview' />
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
                        {isDelete && detail.id ? (
                            <Button type="button" title='Delete this Image' disabled={loading || showCropper} variant={'destructive'} size={'sm'}><Trash2Icon /> Yes, delete it</Button>
                        ) : detail.id ? (
                            <Button
                                title='Select this image'
                                type='button'
                                onClick={() => handleSelectImage(detail.url)}
                                disabled={loading || showCropper}
                                variant={'primary'}
                                size={'sm'}
                                className='w-full md:w-auto'
                            >
                                Select Image
                            </Button>
                        ) : (
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
                        )}
                        {detail.id && <Button title={isDelete ? 'Cancel' : 'Delete this Image'} type="button" onClick={() => setIsDelete(!isDelete)} variant={isDelete ? 'editorBlockBar' : 'destructive'} size={isDelete ? 'sm' : 'iconSm'}>{isDelete ? <XIcon /> : <Trash2Icon />}{isDelete && 'Cancel'}</Button>}
                        {!isDelete && detail.id && <Button type="button" title='close Image Preview' onClick={() => setDetail(initialImage)} disabled={loading || showCropper} variant={'editorBlockBar'} size={'sm'}><XIcon />Close Preview</Button>}
                        {preview && <Button type="button" title='Cancel' onClick={handleCancel} disabled={loading || showCropper} variant={'destructive'} size={'iconSm'}><Trash2Icon /></Button>}
                        {preview && <Button type='button' title='Crop Image' onClick={() => setShowCropper(true)} disabled={loading || showCropper} variant={'editorBlockBar'} size={'iconSm'}><CropIcon /></Button>}
                    </div>

                    {/* <div className='w-full md:w-auto flex justify-end items-center gap-2'>
                        <p className='text-sm dark:text-zinc-400'>Source :</p>
                        <div className='flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 p-1'>
                            <Button type='button' onClick={() => setImgSource({ ...imgSource, storage: true, url: false })} variant={'ghost'} size={'sm'} className={`${imgSource.storage ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} rounded h-7`}>Storage</Button>
                            <Button type='button' onClick={() => setImgSource({ ...imgSource, storage: false, url: true })} variant={'ghost'} size={'sm'} className={`${imgSource.url ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} rounded h-7`}>URL</Button>
                        </div>
                    </div> */}
                    {/* <div className='w-full md:w-auto flex justify-end items-center gap-2'>
                        <p className='text-sm dark:text-zinc-400'>view :</p>
                        <div className='flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-800 p-1'>
                            <Button onClick={() => setGrid(listGrid[0])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[0].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>xs</Button>
                            <Button onClick={() => setGrid(listGrid[1])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[1].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>sm</Button>
                            <Button onClick={() => setGrid(listGrid[2])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[2].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>md</Button>
                            <Button onClick={() => setGrid(listGrid[3])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[3].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>lg</Button>
                            <Button onClick={() => setGrid(listGrid[4])} type='button' variant={'ghost'} size={'sm'} className={`${grid.id === listGrid[4].id ? 'bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200 hover:dark:bg-zinc-900'} w-8 rounded h-7`}>Full</Button>
                        </div>
                    </div> */}
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`}>
                    {!loading ? items.length > 0 ? items.map((i, index) => {
                        let isNull = false;
                        return (
                        <div key={index}>
                            {!isNull ? (
                                <div className={`${detail.id === i.id ? 'border-blue-500' : 'border-template'} relative aspect-[4/3] border rounded-lg`}>
                                    {/* <Image priority title={i.url} src={generateUniqueUrl(i.url)} alt={`Image ${index}`} width={244} height={183} onClick={() => setDetail(i)} onError={() => isNull = true} className="bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow hover:cursor-pointer" /> */}
                                    <Image priority title={i.url} src={i.url} alt={`Image ${index}`} width={244} height={183} onClick={() => setDetail(i)} onError={() => isNull = true} className="bg-zinc-200/50 dark:bg-zinc-900/50 object-contain w-full h-full rounded-lg shadow hover:cursor-pointer" />
                                    {detail.id === i.id && <span className='absolute start-2 bottom-2 text-xs'>Selected</span>}
                                </div>
                            ) : (
                                <div className='aspect-[4/3]'>
                                    <div className='relative bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow'>
                                        <div className='absolute inset-0 flex justify-center items-center'>
                                            <ImageOffIcon className='text-zinc-500' />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className='my-1.5 dark:text-zinc-400 text-xs line-clamp-2'>{i.url}</p>
                            {/* <div className='flex items-center gap-1'>
                                <Button onClick={() => handleSelectImage(i.url)} type="button" variant={'primary'} size={'xs'}>Select</Button>
                                <DeleteImage ref={ref} item={i} index={index} onDelete={() => handleDeleteImage(i.id)} toast={toast} />
                            </div> */}
                        </div>
                    )}) : (
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

type DeleteImageProps = {
    ref?: ForwardedRef<HTMLDivElement>;
    item: { id: string; url: string };
    index: number;
    onDelete?: () => void;
    toast: any;
};

function DeleteImage({ ref, item, index, onDelete, toast }: DeleteImageProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [inValidUrl, setInValidUrl] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        checkUrl();
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const checkUrl = async () => {
        setLoading(true);
        try {
            const isValid = await validateImageURL(item.url, toast);

            if (isValid) {
                setInValidUrl(false);
                setLoading(false);
            } else {
                setInValidUrl(true);
                setLoading(false);
            }

        } catch (error) {
            if (error) {
                console.log("storage => check URL :", error);
                setInValidUrl(true);
                setLoading(false);
            }
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button type="button" onClick={handleOpen} variant={'destructive'} size={'xs'}><Trash2Icon /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent ref={ref}>
                {!loading ? !inValidUrl ? (
                    <div className='aspect-[4/3]'>
                        {/* <Image priority title={item.url} src={generateUniqueUrl(item.url)} alt={`Image ${index + 1}`} width={328} height={246} className="bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow" /> */}
                        <Image priority title={item.url} src={item.url} alt={`Image ${index + 1}`} width={328} height={246} className="bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow" />
                    </div>
                ) : (
                    <div className='aspect-[4/3]'>
                        <div className='relative bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow'>
                            <div className='absolute inset-0 flex justify-center items-center'>
                                <ImageOffIcon className='text-zinc-500' />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='aspect-[4/3]'>
                        <div className='relative bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow'>
                            <div className='absolute inset-0 flex justify-center items-center'>
                                <LoaderIcon className='text-zinc-500 animate-spin' />
                            </div>
                        </div>
                    </div>
                )}
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone, if this image has been or is being used in a post, the image will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default StorageImage