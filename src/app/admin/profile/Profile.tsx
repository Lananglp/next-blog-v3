'use client'
import { patchUser } from '@/app/api/function/users';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { setSession } from '@/context/sessionSlice';
import { setTitle } from '@/context/titleSlice';
import { UserEditFormType, userEditSchema } from '@/helper/schema/schema';
import { responseStatus } from '@/helper/system-config';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/lib/redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { CheckIcon, ImageIcon, KeyIcon, Loader, PenIcon, SendIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { useSingleEffect } from 'react-haiku';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';

type Props = {
    pageTitle: string
};

function Profile({ pageTitle }: Props) {

    const dispatch = useDispatch();

    const setPageTitle = (title: string) => {
        dispatch(setTitle(title));
    }

    useSingleEffect(() => {
        setPageTitle(pageTitle);
    });

    // =========================================================================

    const { isLogin, user, isLoading } = useSelector((state: RootState) => state.session);
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<UserEditFormType>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as 'ADMIN' || 'USER',
            imageFile: undefined,
        }
    });
    const { toast } = useToast();
    const [newPassword, setNewPassword] = useState<string>('');

    useEffect(() => {
        if (isLogin) {
            setValue('id', user.id);
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('image', user.image);
            setValue('role', user.role as 'ADMIN' || 'USER');
        }
    }, [isLogin, setValue, user.id, user.name, user.email, user.image, user.role]);

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

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

    const image = watch('image');

    const onSubmit: SubmitHandler<UserEditFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('id', data.id);
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('password', data.password || '');
            if (data.imageFile) formData.append('imageFile', data.imageFile);

            const res = await patchUser(formData);
            if (res.data?.status) {
                dispatch(setSession({
                    ...user, // Data lama tetap ada
                    ...res.data.item // Data baru akan menimpa yang lama
                }));
                toast({
                    title: res.data.status,
                    description: res.data.message,
                });
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

    const handleResetPassword = () => {
        const generateId = `U${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)}`;
        setValue('password', generateId);
        setNewPassword(generateId);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-xl flex flex-col md:flex-row gap-4'>
            <div className='w-full md:max-w-64'>
                <div className='flex justify-center items-center'>
                    {!isLoading ? (
                        <div {...getRootProps()} className='relative bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-400 rounded-full w-48 h-48 p-6 flex justify-center items-center cursor-pointer'>
                            <input {...getInputProps()} />
                            <div className='flex flex-col items-center text-center gap-2'>
                                <ImageIcon className='h-8 w-8' />
                                <p className='text-xs'>Drag and drop or click to upload an image</p>
                            </div>
                            {image && <Image priority src={`${image}?tr=f-webp`} alt="Preview" width={92} height={92} className='absolute inset-0 h-full w-full object-cover rounded-full bg-zinc-100 dark:bg-zinc-900' />}
                            {image && <div className='absolute -bottom-2 -end-2 bg-zinc-100 dark:bg-zinc-900 border border-template rounded-full p-2'><PenIcon className='h-4 w-4' /></div>}
                        </div>
                    ) : (
                        <Skeleton className='w-48 h-48 rounded-full' />
                    )}
                </div>
                <Controller
                    control={control}
                    name="role"
                    render={({ field }) => {

                        const handleChange = (e: string) => {
                            field.onChange(e);
                        }

                        return (
                            <div className='mt-4'>
                                {!isLoading ?
                                    field.value === 'ADMIN' ? (
                                        <div className='space-y-2'>
                                            <h6 className='text-sm font-medium text-black dark:text-white'>You are an Admin</h6>
                                            <p className='text-xs'>The admin role has full access to the admin menu, can create, edit, and delete blog posts, manage comments, and moderate user interactions.</p>
                                        </div>
                                    ) : (
                                        <div className='space-y-2'>
                                            <h6 className='text-sm font-medium text-black dark:text-white'>You are a User</h6>
                                            <p className='text-xs'>The user role cannot access the admin menu, does not have permission to create blogs, and can only view posts, comments, and give likes.</p>
                                        </div>
                                ) : (
                                    <div className='space-y-2'>
                                        <Skeleton className='w-32 h-7' />
                                        <Skeleton className='w-56 h-4' />
                                        <Skeleton className='w-48 h-4' />
                                        <Skeleton className='w-36 h-4' />
                                    </div>
                                )
                            }
                            </div>
                        )
                    }}
                />
            </div>
            <div className="w-full flex flex-col gap-4">
                {!isLoading ? (
                    <div>
                        <Label htmlFor="name" variant={'primary'}>Name</Label>
                        <Input {...register("name")} className={`${errors.name ? "ring-1 ring-red-500" : ""}`} id="name" type="text" placeholder="Name" />
                        {errors.name && <span className='text-red-500 text-xs mb-2'>{errors.name.message}</span>}
                    </div>
                ) : (
                    <div>
                        <Label variant={'primary'}>Name</Label>
                        <Skeleton className='w-full h-9' />
                    </div>
                )}
                {!isLoading ? (
                    <div>
                        <Label htmlFor="email" variant={'primary'}>Email</Label>
                        <Input {...register("email")} className={`${errors.email ? "ring-1 ring-red-500" : ""}`} id="email" type="email" placeholder="Email" />
                        {errors.email && <span className='text-red-500 text-xs mb-2'>{errors.email.message}</span>}
                    </div>
                ) : (
                    <div>
                        <Label variant={'primary'}>Email</Label>
                        <Skeleton className='w-full h-9' />
                    </div>
                )}
                {newPassword !== '' && (
                    <div className='p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-template space-y-2'>
                        <h6 className='font-medium text-black dark:text-white'><CheckIcon className='inline h-5 w-5 text-green-500 mb-0.5 me-2' />Password has been reset</h6>
                        <p className='text-sm'>New password : <code className='px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded text-black dark:text-white'>{newPassword}</code></p>
                        <p className='text-xs dark:text-yellow-200'>Please save this password immediately, you will not be able to see this password again after returning, and save the data to apply the changes.</p>
                    </div>
                )}

                <div className='flex justify-between items-end gap-1'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type='button' variant={'danger'} disabled={isLoading}><KeyIcon />Reset password</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone, Password of account <span className='font-medium text-black dark:text-white'>{user.name}</span> will be reset.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={isLoading} onClick={handleResetPassword}>Reset</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className='flex items-center gap-1'>
                        <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                            {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Profile