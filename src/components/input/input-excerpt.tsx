"use client";

import { useEffect, useRef } from "react";
import { stripHtml } from "../../app/admin/post/create/html-to-string";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";

interface InputExcerptProps {
    value: string;
    content: string;
    placeholder: string;
    errors?: any;
    control: any;
    name: string;
}

export default function InputExcerpt({ value, content, placeholder, errors, control, name }: InputExcerptProps) {

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
            render={(({ field }) => {

                const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newValue = e.target.value.replace(/\n/g, ""); // Hapus enter
                    field.onChange(newValue); // Memperbarui state internal react-hook-form
                    // onChange(newValue); // Logika custom yang Anda butuhkan
                };

                const generateText = (e: React.MouseEvent<HTMLButtonElement>) => {
                    if (content) {
                        const plainText = stripHtml(content).substring(0, 150).trim(); // Hapus HTML
                        field.onChange(plainText + "...");
                    }
                }

                return (
                    <div>
                        <div className="flex flex-wrap justify-between items-end mb-2">
                            <Label htmlFor="excerpt"><span className="text-red-500">*</span>&nbsp;Post Summary :</Label>
                            <Button
                                type="button"
                                title="get summary from content field"
                                onClick={generateText}
                                variant={'editorBlockBar'}
                                size={'editorBlockBar'}
                            >
                                <RefreshCcw />Auto Generate
                            </Button>
                        </div>
                        <Textarea
                            id="excerpt"
                            {...field}
                            ref={(ref) => {
                                field.ref(ref);
                                textareaRef.current = ref;
                            }}
                            value={value}
                            onChange={handleChange}
                            placeholder={placeholder}
                            rows={3}
                            variant={'primary'}
                            className={`overflow-hidden ${errors && "border-red-500"}`}
                        />
                        {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                    </div>
                )
            })}
                
        />
    );
}
