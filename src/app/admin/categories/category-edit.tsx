'use client'
import { patchCategory, } from '@/app/api/function/categories';
import Modal from '@/components/modal-custom';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoriesFormType, categoriesSchema } from '@/helper/schema/schema';
import { useToast } from '@/hooks/use-toast';
import { SelectedType } from '@/types/all-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { EditIcon, Loader, SendIcon } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
    selected: SelectedType,
    reload: () => void,
    onSuccess?: () => void,
    disabled: any,
}

function CategoriesEdit({ selected, reload, disabled, onSuccess }: Props) {

    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoriesFormType>({
        resolver: zodResolver(categoriesSchema),
        defaultValues: {
            id: '',
            name: '',
        }
    });

    const handleOpen = () => {
        setModal(true);
        setValue("id", selected[0].id || '');
        setValue("name", selected[0].name || '');
    }

    const handleClose = () => {
        reset();
        setModal(false);
    }

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<CategoriesFormType> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        const formdata = new FormData();
        formdata.append("id", data.id || '');
        formdata.append("name", data.name);

        try {
            const res = await patchCategory(formdata);
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
            };
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("AxiosError: ", error.response);
                if (error.response?.data.status) {
                    toast({
                        title: "Oops...",
                        description: `${error.response?.data.message}. (${error.response?.status.toString()})` || "an error occurred",
                    })
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
            <Button type='button' onClick={handleOpen} disabled={disabled} variant={'primary'} size={'sm'} className='w-full'><EditIcon />Edit</Button>

            <Modal open={modal} onClose={handleClose} title='Create new category' width='max-w-md'>
                <div className='flex flex-col gap-4'>
                    <div>
                        <Label htmlFor='name' variant={'primary'}><span className="text-red-500">*</span>&nbsp;Category name</Label>
                        <Input {...register('name')} id='name' variant={errors.name ? 'danger' : 'primary'} placeholder='Enter category name' />
                        {errors.name && <p className="mt-2 text-red-500 text-xs">{errors.name?.message}</p>}
                    </div>
                    <div className='flex justify-end items-center gap-1'>
                        <Button type='button' onClick={handleClose} variant={'primary'}>Close</Button>
                        <Button type='button' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                            {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CategoriesEdit