'use client'
import { patchUserProfile } from '@/app/api/function/users';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setSession } from '@/context/sessionSlice';
import { getCooldownRemainingNumber, getCooldownRemainingToString } from '@/helper/helper';
import { UserProfileFormType, userProfileSchema } from '@/helper/schema/schema';
import { responseStatus } from '@/helper/system-config';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { UserProfileType, UserType } from '@/types/userType'
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { ImageIcon, Loader, PenIcon, SendIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import InputTitle from '@/components/input/input-title';
import PasswordIndicator from '@/components/password-indicator';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

interface ProfileShowProps {
    item: UserType<UserProfileType>;
};

function ProfileShow({ item }: ProfileShowProps) {

    usePageTitle(`Profile ${item.username}`);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, control, watch, setValue, formState: { errors }, setError } = useForm<UserProfileFormType>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            id: item.id || "",
            name: item.name,
            username: item.username,
            email: item.email,
            image: item.image || "",
            role: item.role as 'ADMIN' || 'USER',
            imageFile: undefined,
            password: undefined,
            confirmPassword: undefined,
            bio: item.profile?.bio || '',
            phone_1: item.profile?.phone_1 || '',
            phone_2: item.profile?.phone_2 || '',
            url_1: item.profile?.url_1 || '',
            url_2: item.profile?.url_2 || '',
        }
    });
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // console.log(errors);

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
    const role = watch('role');
    const bio = watch('bio');
    const password = watch('password');

    const onSubmit: SubmitHandler<UserProfileFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", { message: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', data.id);
            formData.append('name', data.name);
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('bio', data.bio || '');
            formData.append('phone_1', data.phone_1 || '');
            formData.append('phone_2', data.phone_2 || '');
            formData.append('url_1', data.url_1 || '');
            formData.append('url_2', data.url_2 || '');
            formData.append('password', data.password || '');
            formData.append('confirmPassword', data.confirmPassword || '');
            if (data.imageFile) formData.append('imageFile', data.imageFile);

            const res = await patchUserProfile(formData);
            if (res.data?.status) {
                dispatch(setSession({
                    ...item, // Data lama tetap ada
                    ...res.data.item // Data baru akan menimpa yang lama
                }));
                toast({
                    title: res.data.status,
                    description: res.data.message,
                });
                setValue('password', undefined);
                setValue('confirmPassword', undefined);
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

    if (!item) return null;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-3xl flex flex-col md:flex-row gap-4'>
            <div className='w-full md:max-w-72 space-y-4 border border-template rounded-lg px-4 pt-8 pb-4'>
                <div className='flex justify-center items-center'>
                    <div {...getRootProps()} className='relative bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-400 rounded-full w-48 h-48 p-6 flex justify-center items-center cursor-pointer'>
                        <input {...getInputProps()} />
                        <div className='flex flex-col items-center text-center gap-2'>
                            <ImageIcon className='h-8 w-8' />
                            <p className='text-xs'>Drag and drop or click to upload an image</p>
                        </div>
                        {image && <Image priority src={image} alt="Preview" width={92} height={92} className='absolute inset-0 h-full w-full object-cover rounded-full bg-white dark:bg-zinc-950' />}
                        {image && <div className='absolute -bottom-2 -end-2 bg-white dark:bg-zinc-950 border border-template rounded-full p-2'><PenIcon className='h-4 w-4' /></div>}
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
                        className={`mb-2 ${errors.username ? "ring-1 ring-red-500" : ""}`}
                    />
                    {errors.username && <span className='text-red-500 text-xs mb-2'>{errors.username.message}</span>}
                    {getCooldownRemainingNumber(item.usernameChangedAt) > 0 ? (
                        <p className='text-xs mb-2'>You can change your username in {item.usernameChangedAt && getCooldownRemainingToString(item.usernameChangedAt, 14) || ""}</p>
                    ) : (
                        <p className='text-xs mb-2'>Regarding security, after changing your username, you can change it again within 14 days.</p>
                    )}
                </div>
                <div>
                    {role === 'ADMIN' ? (
                        <div className='space-y-2'>
                            <h6 className='text-sm font-medium text-black dark:text-white'>You are an Admin</h6>
                            <p className='text-xs'>The admin role has full access to the admin menu, can create, edit, and delete blog posts, manage comments, and moderate user interactions.</p>
                        </div>
                    ) : (
                        <div className='space-y-2'>
                            <h6 className='text-sm font-medium text-black dark:text-white'>You are a User</h6>
                            <p className='text-xs'>The user role cannot access the admin menu, does not have permission to create blogs, and can only view posts, comments, and give likes.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                <div className='grid grid-cols-3 gap-2'>
                    <div className='border border-template rounded-lg gap-1 px-4 py-2'>
                        <p className='text-sm'>Posts</p>
                        <p className='text-black dark:text-white'>{item.totalPosts}</p>
                    </div>
                    <div className='border border-template rounded-lg gap-1 px-4 py-2'>
                        <p className='text-sm'>Followers</p>
                        <p className='text-black dark:text-white'>987{item.totalFollowers}</p>
                    </div>
                    <div className='border border-template rounded-lg gap-1 px-4 py-2'>
                        <p className='text-sm'>Following</p>
                        <p className='text-black dark:text-white'>{item.totalFollowing}</p>
                    </div>
                </div>
                <Tabs defaultValue="account">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <div className='border border-template rounded-lg p-4 space-y-4'>
                            <div className='space-y-1'>
                                <h6 className='text-sm font-medium text-black dark:text-white'>Account</h6>
                                <p className='text-xs'>You can edit your account information here.</p>
                            </div>
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
                            <InputTitle
                                label='Bio'
                                type='text'
                                name='bio'
                                control={control}
                                size='sm'
                                maxWords={100}
                                placeholder='Write something about yourself...'
                                value={bio || ""}
                                errors={errors.bio}
                            />

                            <div className='flex justify-between items-end gap-1'>
                                <div className='flex items-center gap-1'>
                                    <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                                        {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="other">
                        <div className='border border-template rounded-lg p-4 space-y-4'>
                            <div className='space-y-1'>
                                <h6 className='text-sm font-medium text-black dark:text-white'>Other Information</h6>
                                <p className='text-xs'>You can edit your other information here.</p>
                            </div>
                            <div>
                                <Label htmlFor="primaryPhone" variant={'primary'}>Primary Phone</Label>
                                <Input {...register("phone_1")} className={`${errors.phone_1 ? "ring-1 ring-red-500" : ""}`} id="primaryPhone" type="tel" placeholder="Primary Phone" />
                                {errors.phone_1 && <span className='text-red-500 text-xs mb-2'>{errors.phone_1.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="secondaryPhone" variant={'primary'}>Secondary Phone</Label>
                                <Input {...register("phone_2")} className={`${errors.phone_2 ? "ring-1 ring-red-500" : ""}`} id="secondaryPhone" type="tel" placeholder="Secondary Phone" />
                                {errors.phone_2 && <span className='text-red-500 text-xs mb-2'>{errors.phone_2.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="primaryUrl" variant={'primary'}>Primary URL</Label>
                                <Input {...register("url_1")} className={`${errors.url_1 ? "ring-1 ring-red-500" : ""}`} id="primaryUrl" type="url" placeholder="Primary URL" />
                                {errors.url_1 && <span className='text-red-500 text-xs mb-2'>{errors.url_1.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="secondaryUrl" variant={'primary'}>Secondary URL</Label>
                                <Input {...register("url_2")} className={`${errors.url_2 ? "ring-1 ring-red-500" : ""}`} id="secondaryUrl" type="url" placeholder="Secondary URL" />
                                {errors.url_2 && <span className='text-red-500 text-xs mb-2'>{errors.url_2.message}</span>}
                            </div>

                            <div className='flex justify-between items-end gap-1'>
                                <div className='flex items-center gap-1'>
                                    <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                                        {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="password">
                        <div className='border border-template rounded-lg p-4 space-y-4'>
                            <div className='space-y-1'>
                                <h6 className='text-sm font-medium text-black dark:text-white'>Manage Password</h6>
                                <p className='text-xs'>You can change your password here.</p>
                            </div>
                            <div>
                                <Label htmlFor="password" variant={'primary'}>Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("password")} className={`${errors.password ? "ring-1 ring-red-500" : ""}`} id="password" type={showPassword ? "text" : "password"} placeholder="Password" />
                                    <button onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.password && <span className='text-red-500 text-xs mb-2'>{errors.password.message}</span>}
                            </div>
                            <PasswordIndicator password={password || ""} />
                            <div>
                                <Label htmlFor="confirmPassword" variant={'primary'}>Confirm Password</Label>
                                <div className="relative">
                                    <Input autoComplete="off" {...register("confirmPassword")} className={`${errors.confirmPassword ? "ring-1 ring-red-500" : ""}`} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" />
                                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute top-1/2 right-2 -translate-y-1/2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-800 rounded p-1.5' type="button">{showConfirmPassword ? <PiEyeBold className='w-5 h-5' /> : <PiEyeClosedBold className='w-5 h-5' />}</button>
                                </div>
                                {errors.confirmPassword && <span className='text-red-500 text-xs mb-2'>{errors.confirmPassword.message}</span>}
                            </div>

                            <div className='flex justify-between items-end gap-1'>
                                <div className='flex items-center gap-1'>
                                    <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                                        {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </form>
    )
}

export default ProfileShow;