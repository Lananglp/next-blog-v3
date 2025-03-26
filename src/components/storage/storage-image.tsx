import React, { ForwardedRef, useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ImageType, initialImage } from '@/types/image-type';
import { useToast } from '@/hooks/use-toast';
import { deleteImage, getImage, postImage } from '@/app/api/function/image';
import { CropIcon, ImageOffIcon, InfoIcon, LoaderIcon, RedoIcon, RotateCcw, SaveIcon, Trash2Icon, UndoIcon, UploadIcon, XIcon } from 'lucide-react';
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
import { formatDate, formatDateTime, generateUniqueUrl, validateImageURL } from '@/helper/helper';
import ImagePreview from './image-preview';
import { Input } from '../ui/input';
import { IKImage } from "imagekitio-next";
import { Separator } from '../ui/separator';

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
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;
    const [url, setUrl] = useState<string>(value || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ImageType[]>([]);
    const [detail, setDetail] = useState<ImageType>(initialImage);
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

    const handleStateOpen = (value: boolean) => {
        if (value) {
            handleOpen();
        } else {
            handleClose();
        }
    }

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
                fileToUpload = new File([blob], image.name, { type: "image/png" });
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

    const handleSelectImage = async (url: string) => {
        const valid = await validateImageURL(url, toast);
        if (valid) {
            if (onSelect) {
                onSelect(url);
            }
            setOpenModal(false);
            if (onOpenModalChange) {
                onOpenModalChange(false);
            }
        } else {
            if (onSelect) {
                onSelect("");
            }
            setOpenModal(false);
            if (onOpenModalChange) {
                onOpenModalChange(false);
            }
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
        } finally {
            setIsDelete(false);
            setDetail(initialImage);
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
            <AlertDialog open={openModal} onOpenChange={(value) => handleStateOpen(value)}>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant={'editorBlockBar'} size={'sm'} className='w-full'><UploadIcon />Upload from computer</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-5xl h-[96svh] overflow-y-auto'>
                    <AlertDialogHeader className='border-b border-template pb-4'>
                        <AlertDialogTitle>Insert Image</AlertDialogTitle>
                        <AlertDialogDescription className='hidden'>
                            Upload your image here
                        </AlertDialogDescription>
                        <Button type='button' onClick={handleClose} variant={'editorToolBar'} size={'icon'} className='absolute end-6 top-4'><XIcon /></Button>
                    </AlertDialogHeader>
                    <div>
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
                                <ImagePreview urlEndpoint={urlEndpoint} detail={detail} alt='preview' isDetail={isDetail} isDelete={isDelete} />
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
                            <div className='w-full md:w-auto flex items-center gap-1'>
                                {isDelete && detail.id ? (
                                    <Button type="button" title='Delete this Image' onClick={() => handleDeleteImage(detail.id)} disabled={loading || showCropper} variant={'destructive'} size={'sm'}><Trash2Icon /> Yes, delete it</Button>
                                ) : detail.id ? (
                                    <Button
                                        title='Select this image'
                                        type='button'
                                        onClick={() => handleSelectImage(detail.url)}
                                        disabled={loading || showCropper || detail.isError}
                                        variant={'editorBlockBar'}
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
                                {!isDelete && detail.id && <Button type="button" title='close Image Preview' onClick={() => { setDetail(initialImage); setIsDetail(false); }} disabled={loading || showCropper} variant={'editorToolBar'} size={'sm'}><XIcon />Close Preview</Button>}
                                {!isDelete && detail.id && <Separator orientation='vertical' className='h-5' />}
                                {!isDelete && detail.id && <Button type="button" title='Image detail' onClick={() => setIsDetail(!isDetail)} disabled={loading || detail.isError} variant={'editorToolBar'} size={'sm'}><InfoIcon />Detail</Button>}
                                {!isDelete && detail.id && <Separator orientation='vertical' className='h-5' />}
                                {detail.id && <Button title={isDelete ? 'Cancel' : 'Delete this Image'} type="button" onClick={() => { setIsDelete(!isDelete); setIsDetail(false); }} variant={isDelete ? 'editorToolBar' : 'danger'} size={'sm'}>{isDelete ? <XIcon /> : <Trash2Icon />}{isDelete ? 'Cancel' : 'Delete'}</Button>}
                                {preview && <Button type='button' title='Crop Image' onClick={() => setShowCropper(true)} disabled={loading || showCropper} variant={'editorToolBar'} size={'sm'}><CropIcon />Crop</Button>}
                                {preview && <Separator orientation='vertical' className='h-5' />}
                                {preview && <Button type="button" title='Cancel' onClick={handleCancel} disabled={loading || showCropper} variant={'danger'} size={'sm'}><Trash2Icon />Cancel</Button>}
                            </div>
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
                        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-full xl:max-h-[calc(90svh-24rem)] xl:overflow-y-auto pe-2`}>
                            {!loading ? items.length > 0 ? items.map((i, index) => {
                                return (
                                    <StorageImageList
                                        key={i.id}
                                        urlEndpoint={urlEndpoint}
                                        index={index}
                                        item={i}
                                        detail={detail}
                                        onClick={(isError) => {
                                            setDetail({ ...i, isError });
                                            setIsDetail(false);
                                        }}
                                    />
                                )
                            }) : (
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
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

type StorageImageListProps = {
    urlEndpoint: string | undefined;
    index: number;
    item: ImageType;
    detail: ImageType;
    onClick: (isError: boolean) => void;
};

const StorageImageList = ({ urlEndpoint, index, item, detail, onClick }: StorageImageListProps) => {
    const [isValid, setIsValid] = useState(true);
    const [isError, setIsError] = useState(false);
    const timestamp = new Date().getTime();

    // Tambahkan query random agar tidak terkena cache
    // const imageUrl = `${item.url}?tr=w-800,h-auto&v=${timestamp}`;

    // useEffect(() => {
    //     const img: HTMLImageElement = new window.Image(); // Tipe eksplisit

    //     img.src = imageUrl;
    //     img.onload = () => {
    //         if (img.naturalWidth === 0) {
    //             setIsValid(false);
    //         }
    //     };
    //     img.onerror = () => {
    //         setIsValid(false);
    //         setIsError(true);
    //     };
    // }, [imageUrl]);

    return (
        <div>
            <div onClick={() => onClick(isError)} className={`${detail.id === item.id ? "border-blue-500" : "border-template"} relative aspect-[4/3] border rounded-lg hover:cursor-pointer p-1`}>
                <div className='relative isolate bg-zinc-950 aspect-[4/3]'>
                    <IKImage
                        urlEndpoint={urlEndpoint}
                        src={item.url}
                        // src='test.png'
                        title={`Image ${index}`}
                        alt={`Image ${index}`}
                        lqip={{ active: true, quality: 20 }}
                        transformation={[
                            {
                                quality: 60,
                                width: "168",
                                height: "auto",
                                // cropMode: "fill",
                                // rt: "12"
                                format: "auto"
                            },
                            // { raw: "l-text,i-Imagekit,fs-50,l-end" }
                        ]}
                        className="bg-zinc-200/50 dark:bg-zinc-900/50 w-full h-full object-contain rounded-lg shadow"
                        onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.naturalWidth === 0) {
                                setIsValid(false);
                            }
                        }}
                        onError={() => {
                            setIsValid(false);
                            setIsError(true);
                        }}
                    />
                </div>
                {!isValid && (
                    <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 object-contain w-full h-full rounded-lg shadow">
                        <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 text-zinc-500">
                            <ImageOffIcon />
                            <span className="text-xs">Image not found</span>
                        </div>
                    </div>
                )}
                {detail.id === item.id && (
                    <span className="absolute start-0 bottom-0 bg-zinc-200 dark:bg-zinc-950/75 text-black dark:text-white rounded-bl-lg rounded-tr-lg px-3 py-1 text-xs">
                        Selected
                    </span>
                )}
            </div>
            <p className="my-1.5 dark:text-zinc-400 text-xs line-clamp-2">
                No. {index + 1}, Date : {item.createdAt ? formatDateTime(item.createdAt.toString()) : "-"}
            </p>
        </div>
    );
};

export default StorageImage