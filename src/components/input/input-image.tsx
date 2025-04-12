'use client'
import StorageImage from '@/components/storage/storage-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateUniqueUrl, validateImageURL } from '@/helper/helper';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ImageIcon, LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

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
                        <Label htmlFor={label} className="inline-block mb-2">{required && <span className="text-red-500">*</span>}&nbsp;{label}</Label>
                        <div className='relative group'>
                            {field.value !== '' ? (
                                <div className={`min-h-52 relative flex justify-center items-center bg-zinc-100 dark:bg-zinc-900/25 rounded-lg border-2 ${errors ? 'border-solid border-red-500' : 'border-dashed border-zinc-300 dark:border-zinc-800'}`}>
                                    {imgLoading && (
                                        <div className="absolute inset-0 flex items-end bg-zinc-900/50 p-3">
                                            <span className='text-sm'><LoaderIcon className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />Loading...</span>
                                        </div>
                                    )}
                                    <div className='aspect-video h-auto max-h-52'>
                                        <Image priority unoptimized src={field.value} width={328} height={246} alt='post thumbnail' className='w-full h-full object-cover' onLoad={handleImageLoading} onError={() => field.onChange('')} />
                                        {/* <div className='absolute inset-0 opacity-0 hover:opacity-100 flex justify-center items-center hover:bg-zinc-900/50 hover:text-zinc-300 p-8 cursor-pointer transition duration-150'>
                                            <p>Click to change this image.</p>
                                        </div> */}
                                    </div>
                                </div>
                            ) : (
                                <div className={`h-auto md:h-52 flex justify-center items-center bg-zinc-100 dark:bg-zinc-900/25 text-zinc-500 rounded-lg ${errors ? 'border border-solid border-red-500' : 'border-2 border-dashed border-zinc-300 dark:border-zinc-800'} focus:outline focus:outline-1 focus:outline-blue-500 py-20 px-8 text-center transition-colors ${className}`}>
                                    <div>
                                        <p className='mb-1'>Thumbnail Preview.</p>
                                        <p className='text-xs'>Thumbnails must use an aspect ratio of 16:9 (landscape)</p>
                                    </div>
                                </div>
                            )}

                            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        title={`${field.value !== '' ? 'Change' : 'Insert'} Image`}
                                        variant={'editorBlockBar'}
                                        size={'editorBlockBar'}
                                        className={`absolute start-3 bottom-3 bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-200 hover:dark:bg-zinc-900 transition-opacity duration-150 ${field.value !== '' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} ${className}`}
                                    >
                                        <ImageIcon />{field.value !== '' ? 'Change this' : 'Insert'} Image<ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-48 lg:w-80'>
                                    <DropdownMenuLabel>Insert Image</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className='p-2'>
                                        <StorageImage ref={storageImageRef} value={value} onSelect={(url) => handleSelectImage(url)} onClose={() => setIsOpen(false)} />
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>
                    </div>
                )
            }}
        />
    );
}

export default InputImage;
