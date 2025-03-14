"use client"

import { NodeViewWrapper } from "@tiptap/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react"
import { Slider } from "@/components/ui/slider"
import EditorBlockImage from "../editor-block-image"
import { Textarea } from "@/components/ui/textarea"
import { AlignCenter, AlignLeft, AlignRight, Settings2 } from "lucide-react"
import { initialImageWidth } from "./custom-extentions"
import { useMedia } from "react-use"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ResizableImage(props: any) {
    const [width, setWidth] = useState<string>(props.node.attrs.width || initialImageWidth);
    const [height, setHeight] = useState<string>(props.node.attrs.height || "auto");
    const isLgScreen = useMedia('(min-width: 1024px)');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isStorageOpen, setIsStorageOpen] = useState(false);
    const [alt, setAlt] = useState<string>(props.node.attrs.alt || "");
    const [aspectRatio, setAspectRatio] = useState<string>(props.node.attrs.aspectRatio || "auto");
    const [objectFit, setObjectFit] = useState<any>(props.node.attrs.objectFit || "fill");
    const [placeSelf, setPlaceSelf] = useState<any>(props.node.attrs.placeSelf || "start");
    const widthOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const handleOpenStateChange = (value: boolean) => {
        if (value) {
            setIsPopoverOpen(true);
        } else {
            setIsPopoverOpen(false);
            saveSettings();
        }
    }

    // const popoverRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //         if (
    //             popoverRef.current &&
    //             !popoverRef.current.contains(event.target as Node) &&
    //             !isStorageOpen
    //         ) {
    //             setIsPopoverOpen(false);
    //             props.editor.chain().focus().run();
    //         }
    //     }        

    //     if (isPopoverOpen) {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isPopoverOpen, isStorageOpen]); 

    const handleSliderChange = (val: number[]) => {
        // Cari nilai terdekat dari array widthOptions
        const closestValue = widthOptions.reduce((prev, curr) =>
            Math.abs(curr - val[0]) < Math.abs(prev - val[0]) ? curr : prev
        );

        setWidth(`${closestValue}%`);
        saveSettings(); // Simpan setelah update
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setForm({ ...form, [e.target.name]: e.target.value });
    // }

    // const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value.trim();

    //     if (value === "" || value === "0") {
    //         setHeight("auto");
    //     } else {
    //         setHeight(`${parseInt(value)}px`);
    //     }
    // };

    // console.log("real width: ", props.node.attrs.width);
    // console.log("state width: ", width);
    // console.log("real height: ", props.node.attrs.height);
    // console.log("state height: ", height);

    const saveSettings = () => {
        if (props.updateAttributes) {
            props.updateAttributes({
                width,
                height,
                alt: alt,
                objectFit: objectFit,
                aspectRatio: aspectRatio,
                placeSelf: placeSelf,
            })
        }
    }

    // const saveSettings = () => {
    //     if (props.updateAttributes) {
    //         props.updateAttributes((prevAttrs: any) => {
    //             if (
    //                 prevAttrs.width !== width ||
    //                 prevAttrs.height !== height ||
    //                 prevAttrs.alt !== alt ||
    //                 prevAttrs.objectFit !== objectFit ||
    //                 prevAttrs.aspectRatio !== aspectRatio
    //             ) {
    //                 return { width, height, alt, objectFit, aspectRatio }
    //             }
    //             return prevAttrs // Jangan update kalau tidak ada perubahan
    //         })
    //     }
    // }

    return (
        <NodeViewWrapper>
            <figure className="relative group">
                {/* <div
                    className="relative group"
                    style={{
                        width: width,
                        height: height,
                        aspectRatio: aspectRatio,
                        objectFit: objectFit,
                        placeSelf: placeSelf,
                    }}
                > */}
                    <img
                        src={props.node.attrs.src}
                        alt={alt}
                        style={{
                            width: width,
                            height: height,
                            aspectRatio: aspectRatio,
                            objectFit: objectFit,
                            placeSelf: placeSelf,
                        }}
                    />
                    <DropdownMenu open={isPopoverOpen} onOpenChange={(value) => handleOpenStateChange(value)}>
                        <DropdownMenuTrigger asChild >
                            <Button type="button" variant={'primary'} size={'icon'} className={`absolute top-2 right-2 ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-150`}><Settings2 /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side={isLgScreen ? "right" : "bottom"} collisionPadding={60} className='w-80'>
                            <DropdownMenuLabel>Settings Image</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="grid grid-cols-1 gap-2 p-2">
                                <EditorBlockImage editor={props.editor} blockType="change" className="mb-2" onOpenModalChange={(value) => setIsStorageOpen(value)} />
                                {/* <div className="grid grid-cols-12 items-center gap-2">
                                    <Label htmlFor="width" className="block lg:hidden col-span-3 text-right text-xs">Size</Label>
                                    <div className="col-span-9 lg:col-span-12 flex items-center gap-2">
                                        <Slider
                                            value={[parseInt(width)]}
                                            onValueChange={handleSliderChange}
                                            min={10}
                                            max={100}
                                            step={1}
                                            onBlur={saveSettings}
                                        />
                                        <Label htmlFor="width" className="w-8 text-center text-xs">{width}</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 items-center gap-2">
                                    <div className="block lg:hidden col-span-3" />
                                    <div className="col-span-9 lg:col-span-12 text-xs text-zinc-600 dark:text-zinc-400">Size is only applied to desktop displays.</div>
                                </div>
                                <div className="grid grid-cols-12 items-center gap-2">
                                    <Label htmlFor="placeSelf" className="block lg:hidden col-span-3 text-right text-xs">Position</Label>
                                    <div className="col-span-9 lg:col-span-12 flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant={placeSelf === "start" ? 'primary' : 'editorBlockBar'}
                                            size={'xs'}
                                            onClick={() => setPlaceSelf("start")}
                                            onBlur={saveSettings}
                                            className="w-full"
                                        >
                                            <AlignLeft />Start
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={placeSelf === "center" ? 'primary' : 'editorBlockBar'}
                                            size={'xs'}
                                            onClick={() => setPlaceSelf("center")}
                                            onBlur={saveSettings}
                                            className="w-full"
                                        >
                                            <AlignCenter />Center
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={placeSelf === "end" ? 'primary' : 'editorBlockBar'}
                                            size={'xs'}
                                            onClick={() => setPlaceSelf("end")}
                                            onBlur={saveSettings}
                                            className="w-full"
                                        >
                                            <AlignRight />Right
                                        </Button>
                                    </div>
                                </div> */}
                                {/* <div className="grid grid-cols-12 items-center gap-2">
                                <Label htmlFor="height" className="col-span-3 text-right text-xs">
                                    Height
                                </Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={height !== "auto" ? parseInt(height) : ""}
                                    onChange={handleChangeHeight}
                                    onBlur={saveSettings}
                                    className="h-7 col-span-9"
                                    placeholder="auto"
                                    disabled={aspectRatio !== "auto"}
                                    variant={'primary'}
                                />
                            </div> */}
                                {/* <div className="grid grid-cols-12 items-center gap-2">
                                    <Label htmlFor="aspect-ratio" className="block lg:hidden col-span-3 text-right text-xs">
                                        Aspect Ratio
                                    </Label>
                                    <div className="col-span-9 lg:col-span-12 flex items-center gap-1">
                                        <Button type="button" onClick={() => setAspectRatio("auto")} onBlur={saveSettings} variant={aspectRatio === "auto" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">Auto</Button>
                                        <Button type="button" onClick={() => setAspectRatio("16/9")} onBlur={saveSettings} variant={aspectRatio === "16/9" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">16:9</Button>
                                        <Button type="button" onClick={() => setAspectRatio("4/3")} onBlur={saveSettings} variant={aspectRatio === "4/3" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">4:3</Button>
                                        <Button type="button" onClick={() => setAspectRatio("1/1")} onBlur={saveSettings} variant={aspectRatio === "1/1" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">1:1</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 items-center gap-2">
                                    <Label htmlFor="object-fit" className="block lg:hidden col-span-3 text-right text-xs">
                                        Object Fit
                                    </Label>
                                    <div className="col-span-9 lg:col-span-12 flex items-center gap-1">
                                        <Button type="button" onClick={() => setObjectFit("fill")} onBlur={saveSettings} variant={objectFit === "fill" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">Fill</Button>
                                        <Button type="button" onClick={() => setObjectFit("cover")} onBlur={saveSettings} variant={objectFit === "cover" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">Cover</Button>
                                        <Button type="button" onClick={() => setObjectFit("contain")} onBlur={saveSettings} variant={objectFit === "contain" ? 'primary' : 'editorBlockBar'} size={'xs'} className="w-full">Contain</Button>
                                    </div>
                                </div> */}

                                <div className="grid grid-cols-12 items-start gap-2">
                                    <div className="block lg:hidden col-span-3 text-end">
                                        <Label htmlFor="altText" className="text-xs">
                                            Description
                                        </Label>
                                    </div>
                                    <Textarea
                                        id="altText"
                                        value={alt}
                                        onChange={(e) => setAlt(e.target.value)}
                                        rows={3}
                                        className="col-span-9 lg:col-span-12"
                                        placeholder="Describe the image..."
                                        variant={'primary'}
                                        size={'sm'}
                                        onBlur={saveSettings}
                                    />
                                </div>
                                {/* <div className="grid grid-cols-2 gap-1 mt-2">
                                <EditorBlockImage editor={props.editor} blockType="change" />
                                <Button
                                    type="button"
                                    onClick={saveSettings}
                                    variant={'submit'}
                                    size={'xs'}
                                    // className="col-span-2"
                                >
                                    Save
                                </Button>
                            </div> */}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                {/* </div> */}
                <figcaption style={{ width: width, placeSelf: placeSelf, textAlign: placeSelf }} className="text-zinc-600 dark:text-zinc-400 text-xs mt-2">{alt}</figcaption>
            </figure>

            {/* {isPopoverOpen && props.editor.isActive("image") && (
                
            )} */}
        </NodeViewWrapper>
    )
}
