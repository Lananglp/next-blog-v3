'use client'
import StorageImage from '@/components/storage/storage-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateUniqueUrl, validateImageURL } from '@/helper/helper';
import { useToast } from '@/hooks/use-toast';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

type Props = {
    label: string;
    name: string;
    value: string;
    errors?: any;
    control: any;
    placeholder?: string;
    note?: string;
    required?: boolean;
    className?: string;
}

function InputImage({ label, name, value, errors, control, placeholder, note, required, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const storageImageRef = useRef<HTMLDivElement>(null);
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleClick = (event: any) => {
        if (!containerRef.current) return;

        // Jika elemen melayang diklik, abaikan
        if (event.target.closest(".floating-box")) return;

        // Ambil posisi container
        const container = containerRef.current.getBoundingClientRect();
        const elementSize = { width: 340, height: 50 }; // Ukuran elemen melayang

        // Hitung posisi relatif terhadap container
        let x = event.clientX - container.left;
        let y = event.clientY - container.top;

        // Batas maksimum agar elemen tidak keluar dari container
        const maxX = container.width - elementSize.width;
        const maxY = container.height - elementSize.height;

        // Pastikan elemen tetap di dalam batas container
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        setCursorPos({ x, y });
        setIsOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Pastikan refs ada
            if (!dropdownRef.current || !storageImageRef.current) return;

            // Cek jika klik berada di luar dropdown dan modal
            const isClickInsideDropdown = dropdownRef.current.contains(event.target as Node);
            const isClickInsideStorageImage = storageImageRef.current.contains(event.target as Node);

            // Jika klik berada di luar dropdown dan modal, tutup dropdown
            if (!isClickInsideDropdown && !isClickInsideStorageImage) {
                setIsOpen(false);
            }
        };

        // Tambahkan event listener saat dropdown terbuka
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Bersihkan listener saat komponen unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {

                const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setUrl(e.target.value);
                }

                const handleImageLoading = () => {
                    setImgLoading(false);
                };

                const handleImageError = () => {
                    setImgLoading(false);
                    field.onChange('');
                    toast({
                        title: 'Image Error',
                        description: 'Please check your image URL.',
                    })
                };

                // const validateImageURL = async (url: string) => {
                //     try {
                //         const response = await fetch(url, { method: "HEAD" });
                //         const contentType = response.headers.get("content-type");
                        
                //         if (response.status === 404) {
                //             toast({
                //                 title: 'Image not found',
                //                 description: 'The URL of the image you entered was not found.',
                //             });
                //         }
                        
                //         return response.ok && contentType && contentType.startsWith("image/");
                //     } catch (error) {
                //         if (error) {
                //             toast({
                //                 title: 'Invalid URL',
                //                 description: 'Please enter a valid image URL.',
                //             });
                //         }
                //         return false;
                //     }
                // };

                const handleSaveUrl = async () => {
                    const isValid = await validateImageURL(url, toast);
                    if (!isValid) {
                        return;
                    }
                    field.onChange(url); // Simpan perubahan URL
                    setIsOpen(false); // Tutup modal
                };

                const handleSelectImage = (url: string) => {
                    field.onChange(url);
                    setIsOpen(false);
                }

                return (
                    <div>
                        <Label htmlFor={label} className="inline-block mb-2">{required && <span className="text-red-500">*</span>}&nbsp;{label} :</Label>
                        <div ref={containerRef} onClick={handleClick} className='relative'>
                            {field.value !== '' ? (
                                <div className={`relative flex justify-center items-center bg-zinc-100 dark:bg-zinc-900/25 rounded-lg border-2 ${errors ? 'border-solid border-red-500' : 'border-dashed border-zinc-300 dark:border-zinc-800'}`}>
                                    {imgLoading && (
                                        <div className="absolute inset-0 flex items-end bg-zinc-900/50 p-3">
                                            <span className='text-sm'><LoaderIcon className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />Loading...</span>
                                        </div>
                                    )}
                                    <div className='aspect-video h-auto md:h-64'>
                                        <Image priority unoptimized src={generateUniqueUrl(field.value)} width={768} height={432} alt='post thumbnail' className='w-full h-full object-cover' onLoad={handleImageLoading} onError={() => field.onChange('')} />
                                        <div className='absolute inset-0 opacity-0 hover:opacity-100 flex justify-center items-center hover:bg-zinc-900/50 hover:text-zinc-300 p-8 cursor-pointer transition duration-150'>
                                            <p>Click to change this image.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={`h-auto md:h-64 flex justify-center items-center bg-zinc-100 dark:bg-zinc-900/25 hover:bg-zinc-200/50 hover:dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-700 hover:dark:text-zinc-300 rounded-lg ${errors ? 'border border-solid border-red-500' : 'border-2 border-dashed border-zinc-300 dark:border-zinc-800'} focus:outline focus:outline-1 focus:outline-blue-500 py-20 px-8 text-center cursor-pointer transition-colors ${className}`}>
                                    <div>
                                        <p className='mb-1'>Click to upload an image.</p>
                                        <p className='text-xs'>Thumbnails must use an aspect ratio of 16:9 (landscape)</p>
                                    </div>
                                </div>
                            )}
                            <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>

                            {isOpen && (
                                <div
                                    ref={dropdownRef}
                                    style={{
                                        top: cursorPos.y,
                                        left: cursorPos.x,
                                        transform: "translate(0, 10px)", // Geser sedikit ke bawah
                                        // minWidth: "192px",
                                        // maxWidth: "192px",
                                        // wordWrap: "break-word",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="floating-box absolute mt-1 break-words w-80 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-md shadow-lg p-2 z-10"
                                >
                                    <StorageImage ref={storageImageRef} onSelect={(url) => handleSelectImage(url)} onClose={() => setIsOpen(false)} />
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
                                        onChange={handleChangeUrl}
                                        onKeyDown={(e) => e.key === "Enter" && handleSaveUrl()}
                                    />
                                    <div className="flex justify-end mt-2 space-x-1">
                                        <Button type='button' variant={'editorBlockBar'} size={'editorBlockBar'} onClick={() => setIsOpen(false)}>
                                            cancel
                                        </Button>
                                        <Button type='button' variant={'submit'} size={'editorBlockBar'} onClick={handleSaveUrl}>
                                            save
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }}
        />
    );
}

export default InputImage;
