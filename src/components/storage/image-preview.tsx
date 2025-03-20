'use client'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Button } from "../ui/button";
import { CircleAlertIcon, ImageOffIcon, InfoIcon, Loader, Loader2, LoaderIcon, MinusIcon, PlusIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-haiku";
import { ImageType } from "@/types/image-type";
import { formatDateTime } from "@/helper/helper";
import { IKImage } from "imagekitio-next";

interface ImagePreviewProps {
    urlEndpoint: string | undefined;
    isDetail: boolean;
    isDelete: boolean;
    detail: ImageType;
    alt?: string;
}

export default function ImagePreview({ urlEndpoint, isDetail, isDelete, detail, alt }: ImagePreviewProps) {

    // const [loading, setLoading] = useState<boolean>(true);
    const breakpoint = useMediaQuery('(min-width: 768px)', true);

    // useEffect(() => {
    //     setLoading(true);
    // }, [detail.url]);

    return (
        <div className="relative bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg flex justify-center items-center">
            {isDetail && (
                <div className="absolute z-10 inset-0 bg-black/80 dark:bg-black/80 rounded-lg flex justify-start items-end">
                    <div className="p-4 md:p-8">
                        <h6 className="mb-2 text-xl font-semibold text-white border-b border-template pb-2"><InfoIcon className="inline h-6 w-6 mb-1 me-2" />Image Detail</h6>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                            <div className="col-span-3">ID</div>
                            <div className="col-span-1">:</div>
                            <div className="col-span-8">{detail.id}</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                            <div className="col-span-3">URL</div>
                            <div className="col-span-1">:</div>
                            <div className="col-span-8">{detail.url}</div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-sm">
                            <div className="col-span-3">Created at</div>
                            <div className="col-span-1">:</div>
                            <div className="col-span-8">{detail.createdAt ? formatDateTime(detail.createdAt.toString()) : '-'}</div>
                        </div>
                    </div>
                </div>
            )}
            {detail.isError && (
                <div className="absolute z-10 inset-0 bg-zinc-100 dark:bg-zinc-950 text-zinc-500 rounded-lg flex flex-col justify-center items-center p-2">
                    <ImageOffIcon className="h-7 w-7 mb-2" />
                    <div>Image not found</div>
                </div>
            )}
            {isDelete && (
                <div className="absolute z-10 inset-0 bg-black/80 dark:bg-black/80 rounded-lg flex justify-start items-end">
                    <div className="max-w-xl bg-transparent bg-gradient-to-r from-red-950 dark:from-red-950/50 to-transparent rounded-tr-lg rounded-bl-lg p-4 md:p-8">
                        <CircleAlertIcon className="inline h-7 w-7 text-red-500 mb-2" />
                        <h6 className="mb-2 text-xl font-semibold text-white">delete this image?</h6>
                        <p className="text-zinc-300 text-sm">This action cannot be undone, if this image has been or is being used in a post, the image will be lost.</p>
                    </div>
                </div>
            )}
            {/* {loading && (
                <div className="absolute z-10 inset-0 bg-black/10 dark:bg-black/50 text-zinc-900 dark:text-white rounded-lg flex justify-start items-end p-2 animate-pulse">
                    <div><Loader className="inline h-4 w-4 mb-0.5 me-1 animate-spin" />Loading...</div>
                </div>
            )} */}
            <TransformWrapper
                initialScale={1}
                minScale={1}
                limitToBounds={true}
                centerOnInit={true}
                doubleClick={{ mode: "reset" }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => {

                    if (detail.url) {
                        resetTransform();
                    }

                    return (
                        <div>
                            <TransformComponent contentStyle={{ width: breakpoint ? "calc(64rem - 4.9rem)" : "auto", height: "24rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    priority
                                    src={detail.url}
                                    alt={alt || "Preview"}
                                    // lqip={{ active: true, quality: 20 }}
                                    width={608}
                                    height={342}
                                    quality={60}
                                    // transformation={[
                                    //     {
                                    //         height: "auto",
                                    //         format: "auto"
                                    //     },
                                    // ]}
                                    // width={704}
                                    // height={384}
                                    // onError={() => {
                                    //     setLoading(false);
                                    // }}
                                    // onLoad={() => {
                                    //     setLoading(false);
                                    // }}
                                    className="w-full max-w-full max-h-full h-96 object-contain select-none"
                                />
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
                    )
                }}
            </TransformWrapper>
        </div>
    )
}