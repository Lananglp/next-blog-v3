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
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Controller } from 'react-hook-form';
import React from 'react';
import { Label } from './ui/label'
import EditorMenu from './editor/editor-menu'
import EditorFloatingMenu from './editor/editor-floating-menu'
import EditorBubbleMenu from './editor/editor-bubble-menu'
import { CustomImage } from './editor/extentions/custom-extentions'
import EditorLoading from './editor/editor-loading'
import '@/app/text-editor.scss';

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
            render={(({ field }) => {
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



    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            // handlePaste(view, event) {
            //     event.preventDefault(); // Mencegah default behavior

            //     const text = event.clipboardData?.getData("text/plain"); // Ambil teks biasa
            //     if (text) {
            //         view.dispatch(view.state.tr.insertText(text)); // Paste sebagai teks biasa
            //     }
            //     return true;
            // },
        },
        extensions: [
            StarterKit.configure({
                heading: false,
                // code: false,
                // codeBlock: false,
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Typography,
            Underline,
            Subscript,
            Superscript,
            CustomImage,
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
                levels: [2, 3, 4]
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                multicolor: true
            }),
            Placeholder.configure({
                // placeholder: ({ editor }) => (editor.isFocused ? "" : "Write something …"),
                placeholder: ({ node, editor }) => {
                    if (node.type.name === 'heading') {
                        return 'Write your heading...';
                    } else if (node.type.name === 'table') {
                        return '';
                    } else if (editor.isEmpty) {
                        return 'Craft an engaging and informative article here...';
                    }

                    return 'add your text...';
                },
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

    return (
        <div>
            <Label htmlFor="content" className="inline-block mb-2"><span className="text-red-500">*</span>&nbsp;Post Content :</Label>
            {!editor ? <EditorLoading /> : (
                <div className={`border ${errors ? 'border-red-500' : 'border-template'} rounded-lg pt-[1px]`}>
                    {/* <EditorBubbleMenu editor={editor} />
                    <EditorFloatingMenu editor={editor} /> */}
                    <EditorMenu editor={editor} errors={errors} className='sticky top-12 z-10 border-b border-template' />
                    <EditorContent
                        id='content'
                        // className={`rounded-b-lg border-x border-b p-6 min-h-96 md:max-h-[calc(100vh-12rem)] overflow-y-auto ${errors ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'} max-w-none prose dark:prose-invert prose-th:border prose-td:border prose-th:dark:bg-zinc-900/50 prose-zinc prose-th:px-2 prose-li:mb-0 prose-headings:text-zinc-700 prose-headings:dark:text-white prose-strong:text-zinc-700 prose-strong:dark:text-white prose-a:text-zinc-700 prose-a:dark:text-white`}
                        className={`p-6 min-h-96 lg:min-h-[64rem] max-w-none prose dark:prose-invert prose-custom`}
                        editor={editor}
                        onClick={() => editor?.commands.focus()}
                    />
                    {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                </div>
            )}
        </div>
    );
}

export default TextEditor;
