'use client'
import { postCategory } from '@/app/api/function/categories';
import Modal from '@/components/modal-custom';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoriesFormType, categoriesSchema } from '@/helper/schema/schema';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader, PenLine, SendIcon } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { AnimatePresence } from "motion/react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function CategoriesCreate({ reload, onSuccess, disabled }: { reload: () => void, onSuccess?: () => void, disabled?: boolean }) {

  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, reset, getValues, formState: { errors } } = useForm<CategoriesFormType>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: '',
    }
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

  const onSubmit: SubmitHandler<CategoriesFormType> = async (data, event) => {
    event?.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", data.name);

    try {
      const res = await postCategory(formdata);
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
      <AlertDialog open={modal} onOpenChange={(value) => handleStateOpen(value)}>
        <AlertDialogTrigger asChild>
          <Button type='button' onClick={handleOpen} variant={'primary'} disabled={disabled} className='w-full'><PenLine />Create new category</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className='border-b border-template pb-4'>
            <AlertDialogTitle>Create new category</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new category
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex flex-col gap-4'>
            <div>
              <Label htmlFor='name' variant={'primary'}><span className="text-red-500">*</span>&nbsp;Category name</Label>
              <Input onKeyDown={(e) => e.key === 'Enter' && handleClickSubmit()} {...register('name')} id='name' variant={errors.name ? 'danger' : 'primary'} placeholder='Enter category name' />
              {errors.name && <p className="mt-2 text-red-500 text-xs">{errors.name?.message}</p>}
            </div>
            <div className='flex justify-end items-center gap-1'>
              <Button type='button' onClick={handleClose} variant={'primary'}>Close</Button>
              <Button type='submit' onClick={handleClickSubmit} disabled={loading} variant={'submit'}>
                {loading ? <Loader className="animate-spin" /> : <SendIcon />}
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
          {/* <AlertDialogFooter> */}
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' onClick={handleClickSubmit} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <SendIcon />}
              {loading ? 'Saving...' : 'Save'}
            </AlertDialogAction> */}
          {/* </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>

      {/* <AnimatePresence>
        {modal && <Modal enableTransition open={modal} onClose={handleClose} title='Create new category' width='max-w-md'>
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
        </Modal>}
      </AnimatePresence> */}
    </>
  )
}

export default CategoriesCreate