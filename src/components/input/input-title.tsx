"use client";

import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

interface InputTitleProps {
    type: 'heading' | 'text';
    label: string;
    value: string;
    placeholder?: string;
    className?: string;
    errors?: any;
    control: any;
    name: string;
    note?: string;
    maxWords?: number;
    disableWordCount?: boolean;
    required?: boolean;
}

export default function InputTitle({
    type,
    label,
    value,
    placeholder = "Enter title...",
    className = "",
    errors,
    control,
    name,
    note,
    maxWords=100,
    disableWordCount=false,
    required=false
}: InputTitleProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height dulu
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Sesuaikan tinggi
        }
    }, [value]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    let newValue = e.target.value.replace(/\n/g, "");

                    if (!disableWordCount && newValue.length > maxWords) {
                        newValue = newValue.substring(0, maxWords);
                        setErrorMessage(`${label} must be less than ${maxWords} characters.`);
                    } else {
                        setErrorMessage("");
                    }

                    field.onChange(newValue);
                };

                return (
                    <div>
                        <Label htmlFor={label} className="inline-block mb-2">{required && <span className="text-red-500">*</span>}&nbsp;{label} :</Label>
                        <div className="relative">
                            <Textarea
                                {...field}
                                id={label}
                                ref={(ref) => {
                                    field.ref(ref);
                                    textareaRef.current = ref;
                                }}
                                value={value}
                                onChange={handleChange}
                                placeholder={placeholder}
                                rows={2}
                                variant={errors ? "danger" : "primary"}
                                size={type === "heading" ? "xl" : "default"}
                                className={`overflow-hidden ${className}`}
                            />
                            <span className={`${errorMessage && "text-red-500"} absolute right-2 bottom-2 text-xs`}>{!disableWordCount && `${field.value ? field.value.length : 0}/${maxWords}`}</span>
                        </div>
                        {errors ? (
                            <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>
                        ) : !disableWordCount && errorMessage ? (
                            <p className="mt-2 text-red-500 text-xs">{errorMessage}</p>
                        ) : (
                            <p className="mt-2 mx-0.5 text-xs text-zinc-500">{note}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}


{/* <p className="mt-2 text-xs text-zinc-500">
    {`Title will automatically be above the post content with the `}
    <code className="mx-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
        {`<`}
        <span className="text-red-400">{`h1`}</span>
        {`/>`}
    </code>{" "}
    tag
</p> */}