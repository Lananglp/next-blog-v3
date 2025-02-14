import { Color } from '@tiptap/extension-color'
// import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
// import Italic from '@tiptap/extension-italic'
// import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Focus from '@tiptap/extension-focus'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import ImageResize from 'tiptap-extension-resize-image';
import { BubbleMenu, EditorContent, EditorProvider, FloatingMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Controller } from 'react-hook-form';
import React from 'react';
import '@/app/text-editor.css';
import HardBreak from '@tiptap/extension-hard-break'
import { Label } from './ui/label'
import EditorMenu from './editor/editor-menu'

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

    const CustomHardBreak = HardBreak.extend({
        addKeyboardShortcuts() {
            return {
                Enter: ({ editor }) => {
                    const { state } = editor.view;
                    const { selection } = state;
                    const { $from } = selection;
                    const node = $from.node();

                    // Cek jika kita berada dalam paragraph kosong
                    if (node.type.name === "paragraph" && node.content.size === 0) {
                        editor.chain().focus().deleteNode("paragraph").setHardBreak().run();
                        return true;
                    }

                    return false; // Gunakan default Enter jika tidak dalam <p> kosong
                },
            };
        },
    });

    const CustomImage = Image.extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                width: {
                    default: "200px",
                    parseHTML: (element) => element.getAttribute("width") || "200px",
                    renderHTML: (attributes) => {
                        return attributes.width ? { width: attributes.width } : {};
                    },
                },
                height: {
                    default: "200px",
                    parseHTML: (element) => element.getAttribute("height") || "200px",
                    renderHTML: (attributes) => {
                        return attributes.height ? { height: attributes.height } : {};
                    },
                },
            };
        },
    });

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false
            }),
            // Document,
            // Paragraph,
            // Text,
            Typography,
            // Bold,
            // Italic,
            Underline,
            Subscript,
            Superscript,
            CustomImage,
            ImageResize,
            // CustomHardBreak,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Color.configure({
                types: ['textStyle'],
            }),
            // ListItem,
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
                placeholder: 'Write something …',
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

    // if (node && node.type.name === "image") {

    if (!editor) {
        return <div>Loading...</div>;
    }

    const extensions = [StarterKit]

    return (
        <div>
            {/* <EditorProvider
                slotBefore={<MenuEditor className='' editor={editor} />}
                extensions={extensions}
                content={value || ''}
            >

            </EditorProvider> */}
            <Label htmlFor="content" className="inline-block mb-2"><span className="text-red-500">*</span>&nbsp;Post Content :</Label>
            {editor &&
                <FloatingMenu editor={editor}>
                    <span className='text-sm text-zinc-500'>add text here...</span>
                </FloatingMenu>
            }
            {editor && <EditorMenu className='sticky z-30 top-4' editor={editor} errors={errors} />}
            <EditorContent
                id='content'
                className={`w-full rounded-b-lg border-x border-b p-6 min-h-96 ${errors ? 'border-red-500' : 'border-zinc-900'}`}
                editor={editor}
            />
            {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
        </div>
    );
}

export default TextEditor;
