import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, RefreshCcw } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";

interface InputSlugProps {
    value?: string;
    placeholder?: string;
    title: string;
    errors?: any;
    control: any;
    name: string;
}

function InputSlug({ value, placeholder, title, errors, control, name }: InputSlugProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {

                const generateSlug = () => {
                    if (title) {
                        // Hapus karakter non-alfanumerik kecuali spasi
                        const cleanTitle = title
                            .normalize("NFD") // Normalisasi unicode (menghindari karakter aneh)
                            .replace(/[\u0300-\u036f]/g, "") // Hapus aksen
                            .replace(/[^\w\s-]/g, "") // Hapus karakter khusus kecuali spasi & tanda hubung
                            .trim() // Hapus spasi di awal & akhir
                            .replace(/\s+/g, "-") // Ganti semua spasi dengan "-"
                            .toLowerCase(); // Ubah ke huruf kecil

                        field.onChange(cleanTitle);
                    }
                };

                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value;
                    // Gantilah spasi dengan "-" secara real-time
                    const formattedSlug = inputValue
                        .replace(/\s+/g, "-") // Ganti semua spasi dengan "-"
                        .replace(/[^a-zA-Z0-9-]/g, "") // Hapus karakter selain huruf, angka, dan "-"
                        .toLowerCase();

                    field.onChange(formattedSlug);
                };

                return (
                    <div>
                        <div className="flex flex-wrap justify-between items-end mb-2">
                            <Label htmlFor="slug"><span className="text-red-500">*</span>&nbsp;Post Slug :</Label>
                            <Button
                                type="button"
                                title="Generate slug from title"
                                onClick={generateSlug}
                                variant={'editorBlockBar'}
                                size={'editorBlockBar'}
                            >
                                <CopyIcon /> Copy from title
                            </Button>
                        </div>
                        <Input
                            id="slug"
                            {...field}
                            type="text"
                            ref={field.ref}
                            value={value}
                            onChange={handleInputChange}
                            placeholder={placeholder}
                            variant={errors ? "danger" : "primary"}
                        />
                        {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                    </div>
                )
            }}
        />
    );
}

export default InputSlug;
