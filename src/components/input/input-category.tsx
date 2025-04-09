"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useFetchCategories } from "@/hooks/use-fetch-categories";
import { ChevronDown, CircleFadingPlus, Loader, PenLine, RefreshCcw, RotateCcw, Send, Trash, X } from "lucide-react";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Controller, ControllerRenderProps, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../modal-custom";
import { Checkbox } from "../ui/checkbox";
import InputSearch from "./input-search";
import FilterDataPerPage from "../filter/data-per-page";
import CategoriesCreate from "@/app/admin/categories/category-create";
import { Pagination } from "../pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { deleteCategories, patchCategory } from "@/app/api/function/categories";
import { responseStatus } from "@/helper/system-config";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { CategoriesType } from "@/types/category-type";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react"
import { CategoryEditFormType, categoryEditSchema } from "@/helper/schema/schema";

const itemDataPerPage = [
    { number: '16', text: '16 Data' },
    { number: '32', text: '32 Data' },
    { number: '64', text: '64 Data' },
    { number: '128', text: '128 Data' },
    { number: '256', text: '256 Data' },
    { number: '512', text: '512 Data' },
];

interface InputKategoriProps {
    value: string[];
    placeholder?: string;
    errors?: any;
    name: string;
    control: any;
    label: string;
    required?: boolean;
}

export default function InputCategory({ value, placeholder, errors, control, name, label, required }: InputKategoriProps) {
    const { toast } = useToast();
    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(16);
    const [search, setSearch] = useState('');
    const { categories, loading, error, reload } = useFetchCategories('', page, limit, search);
    const items = categories?.items || [];

    const handlePageChange = (value: number) => {
        setPage(value);
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {

                const addCategory = (category: string) => {
                    if (!value.includes(category)) {
                        field.onChange([...value, category]);
                    }
                };

                const toggleSelectedCategory = (category: string) => {
                    const newCategories = value.filter((value) => value !== category);

                    if (!value.includes(category)) {
                        field.onChange([...value, category]);
                    } else {
                        field.onChange(newCategories);
                    }
                    // setDropdownOpen(false);
                };

                const removeCategory = (index: number) => {
                    const newCategories = value.filter((_, i) => i !== index);
                    field.onChange(newCategories);
                };

                const handleDeleteCategory = async (item: CategoriesType) => {
                    if (!item.id) return;

                    try {
                        const ids = [item.id]; // Perbaiki cara passing array
                        const res = await deleteCategories(ids);

                        if (res.data.status === responseStatus.success) {
                            // Hapus kategori yang dihapus dari nilai dalam Controller
                            const updatedCategories = value.filter((category) => category !== item.name);
                            field.onChange(updatedCategories);

                            toast({
                                title: res.data.status,
                                description: res.data.message,
                            });

                            // Tambahkan delay sebelum reload agar UI terlihat responsif
                            setTimeout(() => {
                                reload();
                            }, 500);
                        }
                    } catch (error: unknown) {
                        if (error instanceof AxiosError) {
                            console.log(error.response);
                            toast({
                                title: "Ops...",
                                description: `${error.response?.data?.message}. (${error.response?.status.toString()})` || "Terjadi kesalahan",
                            });
                        } else {
                            console.log("Unknown error:", error);
                        }
                    }
                };

                return (
                    <div>
                        <Label className="inline-block mb-2">{required && <span className="text-red-500">*</span>}&nbsp;{label} :</Label>
                        <div className={`w-full border ${errors ? "border-red-500" : "border-zinc-300 dark:border-zinc-800"} rounded-lg p-1`}>
                            <div className="flex items-center flex-wrap gap-1">
                                {value && value.map((category, index) => (
                                    <span key={index} className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm ps-2.5 pe-0.5 py-0.5">
                                        {category}
                                        <Button type="button" onClick={() => removeCategory(index)} variant={'ghost'} size={'xs'} className="ms-1 h-6 w-6">
                                            <X />
                                        </Button>
                                    </span>
                                ))}
                            </div>
                            <Button
                                // id={label}
                                type="button"
                                variant={'editorBlockBar'}
                                size={'editorBlockBar'}
                                className={value.length > 0 ? "mt-1" : ""}
                                onClick={() => setModal(true)}
                            >
                                <CircleFadingPlus />{placeholder}
                            </Button>
                        </div>
                        {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                        <AnimatePresence>
                            {modal && <Modal enableTransition open={modal} onClose={() => setModal(false)} title="Select a post category" description="The selected categories are automatically saved when you exit" width="max-w-5xl">
                                <div className="space-y-4">
                                    <div className="min-h-24 border border-template rounded-lg p-4">
                                        <div className="flex flex-wrap items-center gap-1">
                                            {value && value.length > 0 ? value.map((category, index) => (
                                                <span key={index} className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm ps-2.5 pe-0.5 py-0.5">
                                                    {category}
                                                    <Button type="button" onClick={() => removeCategory(index)} variant={'ghost'} size={'xs'} className="ms-1 h-6 w-6">
                                                        <X />
                                                    </Button>
                                                </span>
                                            )) : (
                                                <span className="text-sm text-zinc-500">No one has been selected yet</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col lg:flex-row justify-between gap-2 border-b border-template pb-4'>
                                        <div className="flex flex-col lg:flex-row items-center gap-2">
                                            <CategoriesCreate reload={reload} disabled={loading} />
                                            <div className="w-full">
                                                <Button title="Reload / Refresh data" type="button" onClick={() => reload()} variant={'editorBlockBar'} size={'icon'} className="w-full lg:w-9"><RefreshCcw /><span className="inline lg:hidden">Refresh data</span></Button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col lg:flex-row items-center gap-2'>
                                            <FilterDataPerPage
                                                value={limit}
                                                onValueChange={(value) => setLimit(value)}
                                                customItems={itemDataPerPage}
                                                className="w-full lg:w-48"
                                            />
                                            <div className='w-full lg:w-80'>
                                                <InputSearch placeholder='Search ...' onSearch={(value) => setSearch(value)} className='w-full' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                                        {!loading ?
                                            items.length > 0 ?
                                                items.map((item, index) => {
                                                    return (
                                                        <LoopComponent
                                                            key={index}
                                                            index={index}
                                                            item={item}
                                                            field={field}
                                                            onClick={() => toggleSelectedCategory(item.name)}
                                                            loading={loading}
                                                            onConfirm={() => handleDeleteCategory(item)}
                                                            reload={reload}
                                                        />
                                                    )
                                                }) : (
                                                    <div className='px-3 py-1.5 col-span-4 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-lg text-center text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                                        Category is empty.
                                                    </div>
                                                ) : (
                                                <div className='px-3 py-1.5 col-span-4 animate-pulse bg-zinc-200/50 dark:bg-zinc-900/50 rounded-lg text-center text-sm font-medium text-zinc-500 dark:text-zinc-400'>
                                                    <Loader className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />Loading...
                                                </div>
                                            )
                                        }
                                    </div>
                                    <Pagination currentPage={page} totalData={categories?.pagination?.total || 0} dataPerPage={limit} onPageChange={(value) => handlePageChange(value)} />
                                </div>
                            </Modal>}
                        </AnimatePresence>
                    </div>
                )
            }}
        />
    );
}

type LoopComponentType = {
    index: number;
    item: CategoriesType;
    field: ControllerRenderProps<FieldValues, string>
    onClick: MouseEventHandler<HTMLButtonElement>;
    loading: boolean;
    onConfirm: () => void;
    reload: () => void;
}

function LoopComponent({ index, item, field, onClick, loading, onConfirm, reload }: LoopComponentType) {

    const { toast } = useToast();
    const itemRef = useRef<HTMLDivElement>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryEditFormType>({
        resolver: zodResolver(categoryEditSchema),
        defaultValues: {
            id: '',
            name: '',
        }
    });

    const handleOpen = () => {
        setIsEdit(true);
        setValue("id", item.id || '');
        setValue("name", item.name || '');
    }

    const handleClose = () => {
        reset();
        setIsEdit(false);
    }

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<CategoryEditFormType> = async (data, event) => {
        event?.preventDefault();
        setIsSubmitting(true);

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
                const updatedCategories = field.value.map((category: string) =>
                    category === item.name ? data.name : category
                );

                field.onChange(updatedCategories);
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
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!itemRef.current) return;

            const isClickInsideDropdown = itemRef.current.contains(event.target as Node);

            if (!isClickInsideDropdown) {
                handleClose();
            }
        };

        if (isEdit) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEdit]);

    return (
        <div ref={itemRef} key={index} className={`${field.value.map((value: string) => value).includes(item.name) ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-zinc-200/50 dark:bg-zinc-900/50 hover:bg-zinc-200 hover:dark:bg-zinc-900'} relative group border border-template rounded-lg ${isEdit ? 'px-1 py-1' : 'px-3 py-2'}`}>
            <div className="flex items-center gap-2">
                {!isEdit && (
                    <div className='flex items-center'>
                        <Checkbox
                            id={`category${item.id}`}
                            checked={field.value.map((value: string) => value).includes(item.name)}
                            onClick={onClick}
                            variant={'primary'}
                        />
                    </div>
                )}
                {isEdit ? (
                    <Input autoComplete="off" autoFocus {...register('name')} variant={errors.name ? 'danger' : 'primary'} onKeyDown={(e) => e.key === "Enter" && handleClickSubmit()} disabled={isSubmitting} placeholder='Category name' className={`${!errors.name && field.value.map((value: string) => value).includes(item.name) && 'border-zinc-300 dark:border-zinc-700'} h-7 group-hover:me-[4.2rem] placeholder:text-xs`} />
                ) : (
                    <Label htmlFor={`category${item.id}`} className="cursor-pointer line-clamp-1">{item.name}</Label>
                )}
            </div>
            <div className="hidden absolute top-1/2 -translate-y-1/2 end-1.5 group-hover:flex items-center gap-1">
                {isEdit ? (
                    <Button title="Save your changes" type='button' onClick={handleClickSubmit} disabled={isSubmitting} variant={'submit'} size={'iconXs'}><Send /></Button>
                ) : (
                    <Button title="Edit this Category" type="button" onClick={handleOpen} variant={'primary'} size={'iconXs'}><PenLine /></Button>
                )}
                {!isEdit ? (
                    <AlertDelete item={item} disabled={isSubmitting} onConfirm={onConfirm} />
                ) : (
                    <Button title="cancel" type="button" onClick={handleClose} variant={'primary'} size={'iconXs'}><X /></Button>
                )}
            </div>
        </div>
    )
}

type AlertDeleteProps = {
    onConfirm: () => void;
    disabled?: boolean;
    item: CategoriesType;
    className?: string;
}

function AlertDelete({ onConfirm, disabled, item, className }: AlertDeleteProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button title="Delete this Category" disabled={disabled} type="button" variant={'destructive'} size={'iconXs'} className={className}><Trash /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove {item.name} category?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This action will permanently delete your category and delete category data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}