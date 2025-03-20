'use client'
import { postCategory } from '@/app/api/function/categories';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader, PenLine, SendIcon, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { responseStatus } from '@/helper/system-config';
import { CategoryCreateFormType, categoryCreateSchema } from '@/helper/schema/schema';

function CategoriesCreate({ reload, onSuccess, disabled }: { reload: () => void, onSuccess?: () => void, disabled?: boolean }) {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const { register, handleSubmit, control, reset, formState: { errors }, setError } = useForm<CategoryCreateFormType>({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: {
            categories: [{ name: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "categories"
    });

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

    const onSubmit: SubmitHandler<CategoryCreateFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        try {
            // Filter out empty categories and prepare data
            const categoriesToSubmit = data.categories
                .filter((category: { name: string }) => category.name.trim())
                .map((category: { name: string }) => ({ name: category.name.trim() }));

            if (categoriesToSubmit.length === 0) {
                toast({
                    title: responseStatus.warning,
                    description: "Please enter at least one category name",
                });
                setError('categories', { message: 'Please enter at least one category name' });
                return;
            }

            // Send all categories in a single request
            const res = await postCategory(categoriesToSubmit);
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
                    setError('categories', { message: error.response?.data.message.toString() });
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
                    <Button type='button' onClick={handleOpen} variant={'primary'} disabled={disabled} className='w-full'><PenLine />Create new categories</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader className='border-b border-template pb-4'>
                        <AlertDialogTitle>Create new categories</AlertDialogTitle>
                        <AlertDialogDescription>
                            Create multiple categories at once
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col'>
                        <Label variant={'primary'}>
                            <span className="text-red-500">*</span>&nbsp;Category name
                        </Label>
                        <div className={`flex flex-col gap-2 max-h-[50vh] ${fields.length > 1 && 'overflow-y-auto p-1.5'}`}>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <Input
                                        {...register(`categories.${index}.name`)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleClickSubmit()}
                                        id={`categories.${index}.name`}
                                        variant={errors?.categories?.[index]?.name ? 'danger' : 'primary'}
                                        placeholder={fields.length > 1 ? `Category ${index + 1}` : 'Enter category name'}
                                    />
                                    {errors?.categories?.[index]?.name && (
                                        <p className="mt-2 text-red-500 text-xs">{errors?.categories?.[index]?.name?.message}</p>
                                    )}
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size='iconSm'
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            className="bg-transparent hover:bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-black hover:dark:text-white border-dashed border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 hover:dark:border-zinc-500 mb-4 mt-2"
                            onClick={() => append({ name: '' })}
                        >
                            <Plus />Add More
                        </Button>

                        {errors?.categories && (
                            <p className="text-red-500 text-xs">{errors?.categories?.message}</p>
                        )}

                        <div className='flex justify-end items-center gap-1'>
                            <Button type='button' onClick={handleClose} variant={'primary'}>Close</Button>
                            <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                                {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CategoriesCreate