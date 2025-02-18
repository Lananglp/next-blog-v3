import { ReactNodeViewRenderer } from '@tiptap/react'
import Image from '@tiptap/extension-image'
import { ResizableImage } from './image-resize';

export const initialImageWidth = "100%";

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: { default: initialImageWidth },
            height: { default: "auto" },
            alt: { default: "" },
            objectFit: { default: "cover" },
            aspectRatio: { default: "auto" },
            placeSelf: { default: "start" },
        }
    },
    renderHTML({ HTMLAttributes }) {
        return [
            "figure",
            [
                "img",
                {
                    // ...HTMLAttributes,
                    src: HTMLAttributes.src,
                    alt: HTMLAttributes.alt,
                    title: HTMLAttributes.alt,
                    style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height}; object-fit: ${HTMLAttributes.objectFit}; aspect-ratio: ${HTMLAttributes.aspectRatio}; place-self: ${HTMLAttributes.placeSelf};`,
                },
            ],
            HTMLAttributes.alt
                ? [
                    "figcaption",
                    {
                        style: `width: ${HTMLAttributes.width}; place-self: ${HTMLAttributes.placeSelf}; text-align: ${HTMLAttributes.placeSelf};`,
                        class: "text-zinc-600 dark:text-zinc-400 text-xs mt-2",
                    },
                    HTMLAttributes.alt,
                ]
                : "",
        ]
    },
    parseHTML() {
        return [
            {
                tag: "figure",
                getAttrs: (element) => {
                    const img = element.querySelector("img");
                    return img
                        ? {
                            src: img.getAttribute("src"),
                            alt: img.getAttribute("alt"),
                            width: img.style.width,
                            height: img.style.height,
                            objectFit: img.style.objectFit,
                            aspectRatio: img.style.aspectRatio,
                            placeSelf: img.style.placeSelf
                        }
                        : false;
                },
            },
        ];
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImage);
    },
});







// ImageResize,
// Image.extend({
//     addNodeView() {
//         return ReactNodeViewRenderer(ResizableImage)
//     },
//     addAttributes() {
//         return {
//             ...this.parent?.(),
//             width: {
//                 default: '100%',
//                 renderHTML: (attributes) => ({
//                     width: attributes.width,
//                 }),
//             },
//             height: {
//                 default: 'auto',
//                 renderHTML: (attributes) => ({
//                     height: attributes.height,
//                 }),
//             },
//         }
//     },
// }).configure({
//     HTMLAttributes: {
//         class: 'rounded-lg border border-border',
//     },
// }),