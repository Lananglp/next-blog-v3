'use client'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Button } from "../ui/button";
import { Loader, Loader2, LoaderIcon, MinusIcon, PlusIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-haiku";

interface ImagePreviewProps {
    url: string;
    alt?: string;
}

export default function ImagePreview({ url, alt }: ImagePreviewProps) {

    const [loading, setLoading] = useState<boolean>(true);
    const breakpoint = useMediaQuery('(min-width: 768px)', true);

    useEffect(() => {
        setLoading(true);
    }, [url]);

    return (
        <div className="relative bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg flex justify-center items-center">
            {loading && (
                <div className="absolute z-10 inset-0 bg-black/10 dark:bg-black/50 text-zinc-900 dark:text-white rounded-lg flex justify-start items-end p-2 animate-pulse">
                    <div><Loader className="inline h-4 w-4 mb-0.5 me-1 animate-spin" />Loading...</div>
                </div>
            )}
            <TransformWrapper
                initialScale={1}
                minScale={1}
                limitToBounds={true}
                centerOnInit={true}
                doubleClick={{ mode: "reset" }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => {

                    if (url) {
                        resetTransform();
                    }

                    return(
                        <div>
                            <TransformComponent contentStyle={{ width: breakpoint ? "calc(64rem - 4.9rem)" : "auto", height: "24rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Image unoptimized src={url} alt={alt || "Preview"} width={704} height={384} onLoad={() => setLoading(false)} className="max-w-full max-h-full h-96 object-contain select-none" />
                            </TransformComponent>

                            <div className="absolute bottom-2 right-2 flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => zoomIn()}
                                    variant={'editorBlockBar'}
                                    size={'icon'}
                                    className="bg-zinc-100 dark:bg-zinc-950"
                                >
                                    <ZoomInIcon />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => zoomOut()}
                                    variant={'editorBlockBar'}
                                    size={'icon'}
                                    className="bg-zinc-100 dark:bg-zinc-950"
                                >
                                    <ZoomOutIcon />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => resetTransform()}
                                    variant={'editorBlockBar'}
                                    size={'icon'}
                                    className="bg-zinc-100 dark:bg-zinc-950"
                                >
                                    <RotateCcwIcon />
                                </Button>
                            </div>
                        </div>
                )}}
            </TransformWrapper>
        </div>
    )
}