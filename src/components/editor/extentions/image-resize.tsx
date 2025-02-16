"use client"

import { NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react"
import { Slider } from "@/components/ui/slider"
import EditorBlockImage from "../editor-block-image"
import { Textarea } from "@/components/ui/textarea"
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

export function ResizableImage(props: any) {
    const [width, setWidth] = useState<string>(props.node.attrs.width || "50%");
    // const [height, setHeight] = useState<string>(props.node.attrs.height || "auto");
    const [alt, setAlt] = useState<string>(props.node.attrs.alt || "");
    const [aspectRatio, setAspectRatio] = useState<string>(props.node.attrs.aspectRatio || "auto");
    const [objectFit, setObjectFit] = useState<any>(props.node.attrs.objectFit || "cover");
    const [placeSelf, setPlaceSelf] = useState<any>(props.node.attrs.placeSelf || "start");
    const widthOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

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

    const { x, y, refs, strategy } = useFloating({
        placement: "bottom-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const saveSettings = () => {
        if (props.updateAttributes) {
            props.updateAttributes({
                width,
                // height,
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
            <figure>
                <img
                    ref={refs.setReference}
                    src={props.node.attrs.src}
                    alt={alt}
                    style={{
                        width: width,
                        // height: height,
                        aspectRatio: aspectRatio,
                        objectFit: objectFit,
                        placeSelf: placeSelf,
                    }}
                />
                <figcaption style={{ width: width, placeSelf: placeSelf, textAlign: placeSelf }} className="text-zinc-600 dark:text-zinc-400 text-xs mt-2">{alt}</figcaption>
            </figure>
            {props.editor.isActive("image") && (
                <div
                    ref={refs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="w-96 grid grid-cols-1 gap-2 shadow-lg rounded-md bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-2"
                >
                    <EditorBlockImage editor={props.editor} blockType="change" className="mb-2" />
                    <div className="grid grid-cols-12 items-center gap-2">
                        {/* <Label htmlFor="width" className="col-span-3 text-right text-xs">Width</Label> */}
                        <Label htmlFor="width" className="col-span-3 text-right text-xs">Size</Label>
                        <div className="col-span-9 flex items-center gap-2">
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
                        <div className="col-span-3"/>
                        <p className="col-span-9 text-xs text-zinc-600 dark:text-zinc-400">Size is only applied to desktop displays.</p>
                    </div>
                    <div className="grid grid-cols-12 items-center gap-2 mb-2">
                        <Label htmlFor="placeSelf" className="col-span-3 text-right text-xs">Position</Label>
                        <div className="col-span-9 flex items-center gap-2">
                            <Button
                                type="button"
                                variant={'editorBlockBar'}
                                size={'sm'}
                                onClick={() => setPlaceSelf("start")}
                                onBlur={saveSettings}
                                className={`${placeSelf === "start" ? "bg-zinc-800" : ""} px-1 h-7 w-full rounded`}
                            >
                                <AlignLeft />Start
                            </Button>
                            <Button
                                type="button"
                                variant={'editorBlockBar'}
                                size={'sm'}
                                onClick={() => setPlaceSelf("center")}
                                onBlur={saveSettings}
                                className={`${placeSelf === "center" ? "bg-zinc-800" : ""} px-1 h-7 w-full rounded`}
                            >
                                <AlignCenter />Center
                            </Button>
                            <Button
                                type="button"
                                variant={'editorBlockBar'}
                                size={'sm'}
                                onClick={() => setPlaceSelf("end")}
                                onBlur={saveSettings}
                                className={`${placeSelf === "end" ? "bg-zinc-800" : ""} px-1 h-7 w-full rounded`}
                            >
                                <AlignRight />Right
                            </Button>
                        </div>
                    </div>
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
                    <div className="grid grid-cols-12 items-center gap-2">
                        <Label htmlFor="aspect-ratio" className="col-span-3 text-right text-xs">
                            Aspect Ratio
                        </Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger className="col-span-9 h-7">
                                <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                            <SelectContent onBlur={saveSettings}>
                                <SelectItem value="auto">auto</SelectItem>
                                <SelectItem value="16/9">16:9</SelectItem>
                                <SelectItem value="4/3">4:3</SelectItem>
                                <SelectItem value="1/1">1:1</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                        <Label htmlFor="object-fit" className="col-span-3 text-right text-xs">
                            Object Fit
                        </Label>
                        <Select value={objectFit} onValueChange={setObjectFit}>
                            <SelectTrigger className="col-span-9 h-7">
                                <SelectValue placeholder="Select object-fit" />
                            </SelectTrigger>
                            <SelectContent onBlur={saveSettings}>
                                <SelectItem value="cover">Cover</SelectItem>
                                <SelectItem value="contain">Contain</SelectItem>
                                <SelectItem value="fill">Fill</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="scale-down">Scale Down</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-12 items-start gap-2">
                        <div className="col-span-3 text-end">
                            <Label htmlFor="alt" className="text-xs">
                                Deskripsi
                            </Label>
                        </div>
                        <Textarea
                            id="alt"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            rows={3}
                            className="col-span-9"
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
            )}
        </NodeViewWrapper>
    )
}
