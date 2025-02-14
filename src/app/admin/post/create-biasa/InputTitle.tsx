"use client";

import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect } from "react";
import { PostFormValues } from "./page";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

interface InputTitleProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    errors?: any;
    control: any;
    name: string;
}

export default function InputTitle({
    value,
    onChange,
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
                    field.onChange(e); // Memperbarui state internal react-hook-form
                    onChange(newValue); // Logika custom yang Anda butuhkan
                };

                return (
                    <div>
                        <Label htmlFor="title" className="inline-block mb-2"><span className="text-red-500">*</span>&nbsp;Post Title :</Label>
                        <Textarea
                            {...field}
                            id="title"
                            ref={textareaRef}
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
                                <code className="mx-0.5 text-zinc-300 text-sm">
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
