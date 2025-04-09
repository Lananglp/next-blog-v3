"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";

interface InputTagProps {
    label: string;
    value: string[];
    placeholder?: string;
    className?: string;
    errors?: any;
    name: string;
    control: any;
    required?: boolean;
}

export default function InputTag({ label, value, placeholder="Enter tags...", className, errors, control, name, required }: InputTagProps) {

    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const handleFocus = () => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                };

                const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" || e.key === "," && inputValue.trim() !== "") {
                        e.preventDefault();
                        const newTags = [...value, inputValue.trim()];
                        field.onChange(newTags);
                        setInputValue("");
                    }
                };

                const removeTag = (index: number) => {
                    const newTags = value.filter((_, i) => i !== index);
                    field.onChange(newTags);
                };

                return (
                    <div>
                        <Label className="inline-block mb-2">{required && <span className="text-red-500">*</span>}&nbsp;{label} :</Label>
                        <div onClick={handleFocus} className={`w-full flex items-center flex-wrap gap-1 border ${errors ? "border-red-500" : "border-zinc-300 dark:border-zinc-800"} rounded-lg p-1`}>
                            {value && value.map((tag, index) => (
                                <span key={index} className="flex items-center bg-zinc-200 dark:bg-zinc-900 rounded text-sm ps-2.5 pe-0.5 py-0.5">
                                    {tag}
                                    <Button type="button" onClick={() => removeTag(index)} variant={'ghost'} size={'xs'} className="ms-1 h-6 w-6">
                                        <X />
                                    </Button>
                                </span>
                            ))}
                            <Input
                                {...field}
                                // id={label}
                                ref={(ref) => {
                                    field.ref(ref);
                                    inputRef.current = ref;
                                }}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className={`px-2 py-0 h-7 w-auto border-none bg-transparent focus:outline-none ${className}`}
                            />
                        </div>
                        {errors ? (
                            <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>
                        ) : (
                            <p className="mt-2 text-xs text-zinc-500">Press the <code className="text-base text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-900 rounded px-1">Enter</code> or <code className="text-base text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-900 rounded px-1">,</code> to make multiple selections</p>
                        )}
                    </div>
                )}
            }
        />
    );
}
