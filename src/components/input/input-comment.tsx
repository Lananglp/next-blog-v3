"use client";

import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useMedia } from "react-use";
import { Button } from "../ui/button";
import { LoaderCircle, Send } from "lucide-react";

interface InputCommentProps {
    value: string;
    placeholder?: string;
    className?: string;
    errors?: any;
    control: any;
    name: string;
    required?: boolean;
    isLoading?: boolean;
    onSubmit?: () => void;
    onHeightChange?: (height: number) => void;
}

export default function InputComment({
    value,
    placeholder = "write a comment...",
    className = "",
    errors,
    control,
    name,
    required = false,
    onSubmit,
    onHeightChange,
    isLoading,
}: InputCommentProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isMobile = useMedia('(max-width: 1024px)');
    // const [textareaHeight, setTextareaHeight] = useState<number>(0);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to recalculate
            const maxHeight = 10 * parseFloat(getComputedStyle(textareaRef.current).lineHeight);
            const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
            textareaRef.current.style.height = `${newHeight}px`;
            // setTextareaHeight(newHeight);
            if (onHeightChange) onHeightChange(newHeight);
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [value]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    field.onChange(e.target.value);
                    adjustTextareaHeight();
                };

                const handleSubmit = () => {

                    if (!field.value) return

                    if (onSubmit) {
                        onSubmit();
                    }
                };

                return (
                    <div>
                        <div className={`relative overflow-hidden ${className}`}>
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={handleChange}
                                variant={'primary'}
                                className='ps-4 pt-4 pb-2 pe-[3.5rem] resize-none border-none'
                                placeholder={placeholder}
                                rows={1}
                                // disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                variant={'submit'}
                                className="absolute bottom-2.5 right-2.5 rounded-full w-10 h-10 hover:scale-105 transition duration-200"
                            >
                                {isLoading ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <Send />
                                )}
                            </Button>
                        </div>
                        {errors && (
                            <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}