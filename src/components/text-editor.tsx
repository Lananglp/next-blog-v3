'use client'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Focus from '@tiptap/extension-focus'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Controller } from 'react-hook-form';
import React from 'react';
import '@/app/text-editor.css';
import { Label } from './ui/label'
import EditorMenu from './editor/editor-menu'
import EditorFloatingMenu from './editor/editor-floating-menu'
import EditorBubbleMenu from './editor/editor-bubble-menu'
import Image from '@tiptap/extension-image'
import { ResizableImage } from './editor/extentions/image-resize'

type EditorProps = {
    control: any;
    name: string;
    errors?: any;
};

const TextEditor = ({ control, name, errors }: EditorProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={(({field}) => {
                return (
                    <EditorLayout
                        field={field}
                        errors={errors}
                    />
                )
            })}
        />
    )
}

type EditorLayoutProps = {
    field: {
        onChange: (...event: any[]) => void
        value: any
    };
    errors?: any;
};

function EditorLayout({ errors, field }: EditorLayoutProps) {

    const CustomImage = Image.extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                width: { default: "50%" },
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

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false
            }),
            Typography,
            Underline,
            Subscript,
            Superscript,
            CustomImage,
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
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Color.configure({
                types: ['textStyle'],
            }),
            TextStyle,
            Focus.configure({
                className: 'outline outline-offset-2 outline-1 outline-blue-600',
                mode: 'deepest',
            }),
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6]
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                multicolor: true
            }),
            Placeholder.configure({
                placeholder: ({ editor }) => (editor.isFocused ? "" : "Write something …"),
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },

            }),
        ],
        content: field.value || '',
        onUpdate: ({ editor }) => {
            field.onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Label htmlFor="content" className="inline-block mb-2"><span className="text-red-500">*</span>&nbsp;Post Content :</Label>
            <EditorBubbleMenu editor={editor} />
            <EditorFloatingMenu editor={editor} />
            <EditorMenu editor={editor} errors={errors} />
            <EditorContent
                id='content'
                className={`w-full rounded-b-lg border-x border-b p-6 min-h-96 ${errors ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'}`}
                editor={editor}
                onClick={() => editor?.commands.focus()}
            />
            {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
        </div>
    );
}

export default TextEditor;
