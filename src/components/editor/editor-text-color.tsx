import React, { useState, useEffect, useRef } from "react";
import { CompactPicker } from "react-color";
import { useFloating, autoUpdate, offset, shift, flip } from "@floating-ui/react";

function EditorTextColor({ editor }: { editor: any }) {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);

    // Pastikan editor selalu dideklarasikan agar useEffect tidak bersifat kondisional
    const getCurrentColor = editor?.getAttributes("textStyle").color || "#d4d4d8";

    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    // Menutup picker setelah memilih warna
    const handleColorChange = (newColor: any) => {
        editor?.chain().focus().setColor(newColor.hex).run();
        setShowPicker(false);
    };

    // Menutup picker jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPicker]);

    return editor ? (
        <div className="relative w-24">
            <div onClick={() => setShowPicker(!showPicker)} className="flex items-center space-x-1 cursor-pointer">
                <div
                    ref={refs.setReference}
                    style={{ backgroundColor: getCurrentColor }}
                    className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-900"
                />
                <span className="text-xs">{getCurrentColor}</span>
            </div>

            {showPicker && (
                <div
                    ref={(ref) => {
                        refs.setFloating(ref);
                        pickerRef.current = ref;
                    }}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="z-10 shadow-lg rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-1"
                >
                    <CompactPicker className="custom-color-picker" color={getCurrentColor} onChange={handleColorChange} />
                </div>
            )}
        </div>
    ) : (
        <div /> // Pastikan ada elemen pengganti agar hooks tetap terpanggil
    );
}

export default EditorTextColor;
