"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

interface InputKategoriProps {
    value: string[];
    onChange: (categories: string[]) => void;
    placeholder?: string;
    errors?: any;
    name: string;
    control: any;
}

const availableCategories = ["Gadget", "Hukum", "Alam", "Teknologi", "Kesehatan", "Olahraga", "Pendidikan"];

export default function InputCategory({ value, onChange, placeholder, errors, control, name }: InputKategoriProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {

                const addCategory = (category: string) => {
                    if (!value.includes(category)) {
                        field.onChange([...value, category]);
                    }
                    setDropdownOpen(false);
                };

                const removeCategory = (index: number) => {
                    const newCategories = value.filter((_, i) => i !== index);
                    field.onChange(newCategories);
                };

                return (
                    <div>
                        <Label htmlFor="category" className="inline-block mb-2">Post Category :</Label>
                        <div className={`w-full border ${errors ? "border-red-500" : "border-zinc-900"} rounded-lg p-1`}>
                            <div className="flex items-center flex-wrap gap-1">
                                {value && value.map((category, index) => (
                                    <span key={index} className="flex items-center bg-zinc-900 rounded text-sm ps-2.5 pe-0.5 py-0.5">
                                        {category}
                                        <Button type="button" onClick={() => removeCategory(index)} variant={'ghost'} size={'xs'} className="ms-1 h-6 w-6">
                                            <X />
                                        </Button>
                                    </span>
                                ))}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        id="category"
                                        type="button"
                                        variant={'editorBlockBar'}
                                        size={'editorBlockBar'}
                                        className={value.length > 0 ? "mt-1" : ""}
                                    >
                                        {placeholder}<ChevronDown className="inline w-4 h-4 ms-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {availableCategories && availableCategories.map((category) => (
                                        <DropdownMenuItem
                                            key={category}
                                            onClick={() => addCategory(category)}
                                            disabled={value.includes(category)}
                                        >
                                            {category}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                    </div>
                )
            }}
        />
    );
}
