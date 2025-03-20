'use client'
import { postCategory } from '@/app/api/function/categories';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader, PenLine, SendIcon, Plus, Trash2, ImageIcon, PenIcon } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { responseStatus } from '@/helper/system-config';
import { CategoryCreateFormType, UserFormType, userSchema } from '@/helper/schema/schema';
import { postUser } from '@/app/api/function/users';
import PasswordIndicator from '@/components/password-indicator';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

function UserCreate({ reload, onSuccess, disabled }: { reload: () => void, onSuccess?: () => void, disabled?: boolean }) {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const { toast } = useToast();

    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors }, setError } = useForm<UserFormType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'USER',
            imageFile: undefined,
        }
    });

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setValue('imageFile', file);
        setValue('image', URL.createObjectURL(file));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
    });

    const password = watch('password');
    const image = watch('image');

    const handleOpen = () => {
        setModal(true);
    }

    const handleClose = () => {
        reset();
        setModal(false);
    }

    const handleStateOpen = (state: boolean) => {
        if (state) {
            setModal(true);
        } else {
            reset();
            setModal(false);
        }
    }

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<UserFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            setLoading(false);
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('confirmPassword', data.confirmPassword);
            formData.append('role', data.role);
            if (data.imageFile) formData.append('imageFile', data.imageFile);

            const res = await postUser(formData);
            if (res.data?.status) {
                toast({
                    title: res.data.status,
                    description: res.data.message,
                });
                reload();
                handleClose();
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("AxiosError: ", error.response);
                if (error.response?.data.status) {
                    toast({
                        title: responseStatus.error,
                        description: `${error.response?.data.message.toString()}. (${error.response?.status.toString()})` || "an error occurred",
                    });
                }
            } else {
                console.log("Unknown error: ", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertDialog open={modal} onOpenChange={(value) => handleStateOpen(value)}>
                <AlertDialogTrigger asChild>
                    <Button type='button' onClick={handleOpen} variant={'primary'} disabled={disabled} className='w-full'><PenLine />Create new user</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-3xl max-h-[96svh] overflow-y-auto'>
                    <AlertDialogHeader className='border-b border-template pb-4'>
                        <AlertDialogTitle>Create new user</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please fill in the form below to create a new user
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full md:max-w-64'>
                            <div className='flex justify-center items-center'>
                                <div {...getRootProps()} className='relative bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-400 rounded-full w-48 h-48 p-6 flex justify-center items-center cursor-pointer'>
                                    <input {...getInputProps()} />
                                    <div className='flex flex-col items-center text-center gap-2'>
                                        <ImageIcon className='h-8 w-8' />
                                        <p className='text-xs'>Drag and drop or click to upload an image</p>
                                    </div>
                                    {image && <Image src={image} alt="Preview" width={48} height={48} className='absolute inset-0 h-full w-full object-cover rounded-full bg-zinc-100 dark:bg-zinc-900' />}
                                    {image && <div className='absolute -bottom-2 -end-2 bg-zinc-100 dark:bg-zinc-900 border border-template rounded-full p-2'><PenIcon className='h-4 w-4' /></div>}
                                </div>
                            </div>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field }) => {

                                    const handleChange = (e: string) => {
                                        field.onChange(e);
                                    }

                                    return (
                                        <div>
                                            <Label variant={'primary'}>Role</Label>
                                            <Select {...field} onValueChange={handleChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USER">USER</SelectItem>
                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {field.value === 'ADMIN' ? (
                                                <div>
                                                    <h6 className='mb-2 text-sm font-medium text-black dark:text-white mt-4'>Admin Role Info</h6>
                                                    <p className='text-xs'>The admin role has full access to the admin menu, can create, edit, and delete blog posts, manage comments, and moderate user interactions.</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h6 className='mb-2 text-sm font-medium text-black dark:text-white mt-4'>User Role Info</h6>
                                                    <p className='text-xs'>The user role cannot access the admin menu, does not have permission to create blogs, and can only view posts, comments, and give likes.</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <div>
                                <Label htmlFor="name" variant={'primary'}>Name</Label>
                                <Input {...register("name")} className={`${errors.name ? "ring-1 ring-red-500" : ""}`} id="name" type="text" placeholder="Name" />
                                {errors.name && <span className='text-red-500 text-xs mb-2'>{errors.name.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="email" variant={'primary'}>Email</Label>
                                <Input {...register("email")} className={`${errors.email ? "ring-1 ring-red-500" : ""}`} id="email" type="email" placeholder="Email" />
                                {errors.email && <span className='text-red-500 text-xs mb-2'>{errors.email.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="password" variant={'primary'}>Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("password")} className={`${errors.password ? "ring-1 ring-red-500" : ""}`} id="password" type={showPassword ? "text" : "password"} placeholder="Password" />
                                    <button onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.password && <span className='text-red-500 text-xs mb-2'>{errors.password.message}</span>}
                            </div>
                            <PasswordIndicator password={password} />
                            <div>
                                <Label htmlFor="confirmPassword" variant={'primary'}>Confirm Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("confirmPassword")} className={`${errors.confirmPassword ? "ring-1 ring-red-500" : ""}`} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" />
                                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showConfirmPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.confirmPassword && <span className='text-red-500 text-xs mb-2'>{errors.confirmPassword.message}</span>}
                            </div>

                            <div className='flex justify-end items-end gap-1'>
                                <div className='flex items-center gap-1'>
                                    <Button type='button' onClick={handleClose} variant={'primary'}>Close</Button>
                                    <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                                        {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default UserCreate