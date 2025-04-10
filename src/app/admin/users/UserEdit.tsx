'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader, SendIcon, ImageIcon, PenIcon, EditIcon, KeyIcon, CheckIcon } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { responseStatus } from '@/helper/system-config';
import { UserEditFormType, userEditSchema } from '@/helper/schema/schema';
import { patchUser } from '@/app/api/function/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { UserType } from '@/types/userType';
import { getCooldownRemainingNumber, getCooldownRemainingToString } from '@/helper/helper';

function UserEdit({ item, reload, onSuccess, disabled }: { item: UserType, reload: () => void, onSuccess?: () => void, disabled?: boolean }) {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const { toast } = useToast();

    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors }, setError } = useForm<UserEditFormType>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            image: '',
            role: 'USER',
            imageFile: undefined,
        }
    });

    // console.log(errors);

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
        setValue("id", item.id || '');
        setValue("name", item.name || '');
        setValue("username", item.username || '');
        setValue("email", item.email || '');
        setValue("role", item.role as 'ADMIN' || 'USER');
        setValue("image", item.image ? item.image : '');

    }

    const handleClose = () => {
        reset();
        setModal(false);
        setNewPassword('');
    }

    const handleStateOpen = (state: boolean) => {
        if (state) {
            setModal(true);
        } else {
            handleClose();
        }
    }

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<UserEditFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('id', data.id);
            formData.append('name', data.name);
            formData.append('username', data.username || '');
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('password', data.password || '');
            if (data.imageFile) formData.append('imageFile', data.imageFile);

            const res = await patchUser(formData);
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

    const handleResetPassword = () => {
        const generateId = `U${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)}`;
        setValue('password', generateId);
        setNewPassword(generateId);
    }

    return (
        <>
            <AlertDialog open={modal} onOpenChange={(value) => handleStateOpen(value)}>
                <AlertDialogTrigger asChild>
                    <Button type='button' onClick={handleOpen} disabled={disabled} variant={'primary'} size={'sm'} className='w-full'><EditIcon />Edit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-3xl max-h-[96svh] overflow-y-auto'>
                    <AlertDialogHeader className='border-b border-template pb-4'>
                        <AlertDialogTitle>Edit a user</AlertDialogTitle>
                        <AlertDialogDescription>
                        Change user data by filling in the form below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full md:max-w-64 space-y-4'>
                            <div className='flex justify-center items-center'>
                                <div {...getRootProps()} className='relative bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-400 rounded-full w-48 h-48 p-6 flex justify-center items-center cursor-pointer'>
                                    <input {...getInputProps()} />
                                    <div className='flex flex-col items-center text-center gap-2'>
                                        <ImageIcon className='h-8 w-8' />
                                        <p className='text-xs'>Drag and drop or click to upload an image</p>
                                    </div>
                                    {image && <Image src={image} alt="Preview" width={192} height={192} className='absolute inset-0 h-full w-full object-cover rounded-full bg-zinc-100 dark:bg-zinc-900' />}
                                    {image && <div className='absolute -bottom-2 -end-2 bg-zinc-100 dark:bg-zinc-900 border border-template rounded-full p-2'><PenIcon className='h-4 w-4' /></div>}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="username" variant={'primary'}>Username</Label>
                                <Input
                                    id="username"
                                    placeholder="username"
                                    type="text"
                                    disabled={getCooldownRemainingNumber(item.usernameChangedAt) > 0 && true || false}
                                    {...register("username", {
                                        onChange: (e) => {
                                            // Normalisasi: huruf kecil, spasi jadi '_', karakter selain a-z, 0-9, _ dan . dihapus
                                            const cleaned = e.target.value
                                                .toLowerCase()
                                                .replace(/\s+/g, "_")
                                                .replace(/[^a-z0-9._]/g, "");
                                            e.target.value = cleaned;
                                        }
                                    })}
                                    className={`${errors.username ? "ring-1 ring-red-500" : ""}`}
                                />
                                {errors.username && <span className='text-red-500 text-xs mb-2'>{errors.username.message}</span>}
                                {getCooldownRemainingNumber(item.usernameChangedAt) > 0 && <span className='text-xs mb-2'>You can change your username in {item.usernameChangedAt && getCooldownRemainingToString(item.usernameChangedAt, 14) || ""}</span>}
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
                                        <Button type='button' variant={'danger'}><KeyIcon />Reset password</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone, Password of account <span className='font-medium text-black dark:text-white'>{item.name}</span> will be reset.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleResetPassword}>Reset</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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

export default UserEdit