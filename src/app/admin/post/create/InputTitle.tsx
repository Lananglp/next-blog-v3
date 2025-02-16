"use client";

import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect } from "react";
import { PostFormValues } from "./page";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

interface InputTitleProps {
    value: string;
    placeholder?: string;
    className?: string;
    errors?: any;
    control: any;
    name: string;
}

export default function InputTitle({
    value,
    placeholder = "Enter title...",
    className = "",
    errors,
    control,
    name,
}: InputTitleProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                    const newValue = e.target.value.replace(/\n/g, ""); // Hapus enter
                    field.onChange(newValue);
                };

                return (
                    <div>
                        <Label htmlFor="title" className="inline-block mb-2"><span className="text-red-500">*</span>&nbsp;Post Title :</Label>
                        <Textarea
                            {...field}
                            id="title"
                            ref={(ref) => {
                                field.ref(ref);
                                textareaRef.current = ref;
                            }}
                            value={value}
                            onChange={handleChange}
                            placeholder={placeholder}
                            rows={2}
                            variant={"primary"}
                            size={"xl"}
                            className={`overflow-hidden ${className} ${errors && "border-red-500"}`}
                        />
                        {errors ? (
                            <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>
                        ) : (
                            <p className="mt-2 text-xs text-zinc-500">
                                {`Title will automatically be above the post content with the `}
                                <code className="mx-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
                                    {`<`}
                                    <span className="text-red-400">{`h1`}</span>
                                    {`/>`}
                                </code>{" "}
                                tag
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}
