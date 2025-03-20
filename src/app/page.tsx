'use client'
import EditorAlign from "@/components/editor/editor-align";
import EditorMarkOne from "@/components/editor/editor-mark-one";
import EditorTextTypeDropdown from "@/components/editor/editor-text-type-dropdown";
import EditorUndoRedo from "@/components/editor/editor-undo-redo";
import Template from "@/components/template-custom";
import { Skeleton } from "@/components/ui/skeleton";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Gauge, LoaderIcon, PencilRuler, PenLine, TrendingUp } from "lucide-react";
import Image from "next/image";

const SmallDemoEditor = () => {

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: '<h2>Start expressing your ideas here</h2><p><strong>Expressing ideas</strong> is crucial for innovation, problem-solving, and growth. It allows individuals to share <em>knowledge</em>, inspire others, and <u>contribute to progress</u>.</p>',
    })
    // const value = editor?.getHTML();

    return (
        <div className="max-w-96 md:max-w-[456px]">
            {!editor ? <EditorLoading /> : (
                <>
                    {/* <EditorBubbleMenu editor={editor} />
                    <EditorFloatingMenu editor={editor} /> */}
                    <SmallEditorMenu editor={editor} />
                    <EditorContent
                        id='content'
                        // className={`rounded-b-lg border-x border-b p-6 min-h-96 md:max-h-[calc(100vh-12rem)] overflow-y-auto ${errors ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'} max-w-none prose dark:prose-invert prose-th:border prose-td:border prose-th:dark:bg-zinc-900/50 prose-zinc prose-th:px-2 prose-li:mb-0 prose-headings:text-zinc-700 prose-headings:dark:text-white prose-strong:text-zinc-700 prose-strong:dark:text-white prose-a:text-zinc-700 prose-a:dark:text-white`}
                        className={`rounded-b-lg border px-6 pb-6 min-h-[300px] overflow-y-auto max-h-[300px] w-full prose dark:prose-invert prose-custom`}
                        editor={editor}
                        onClick={() => editor?.commands.focus()}
                    />
                    {/* <p>{value}</p> */}
                </>
            )}
        </div>
    )
};

function EditorLoading() {
    return (
        <div className='border border-template rounded-lg'>
            <div className='p-2 bg-zinc-100 dark:bg-zinc-950 rounded-t-lg border-b border-template'>
                <div className='flex flex-wrap items-center gap-1'>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-32' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-36' />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='h-7 w-36' />
                    </div>
                </div>
            </div>
            <div className='h-72 p-4'>
                <LoaderIcon className='inline h-4 w-4 mb-0.5 me-1 animate-spin' />
                <span className='text-zinc-600 dark:text-zinc-500'>Loading editor...</span>
            </div>
        </div>
    )
}

type Props = {
    className?: string;
    editor: Editor;
};

const SmallEditorMenu = ({ className, editor }: Props) => {

    if (!editor) {
        return null
    }

    return (
        <div className={className}>
            <div className={`flex flex-col bg-zinc-100 dark:bg-zinc-950 rounded-t-lg border-x border-t border-zinc-300 dark:border-zinc-800`}>
                <div className="flex flex-wrap items-center gap-1 p-2">
                    {/* <EditorUndoRedo editor={editor} />
                    <EditorVerticalLine /> */}
                    <EditorTextTypeDropdown editor={editor} />
                    <EditorVerticalLine />
                    <EditorMarkOne editor={editor} />
                    <EditorVerticalLine />
                    {/* <EditorMarkSecond editor={editor} />
                    <EditorVerticalLine /> */}
                    <EditorAlign editor={editor} />
                </div>
            </div>
        </div>
    )
}

const EditorVerticalLine = () => {
    return (
        <div className='px-2 flex justify-center items-center'>
            <div className='h-6 inline-block border-s border-zinc-300 dark:border-zinc-700' />
        </div>
    )
}

export default function Home() {
    return (
        <Template>
            <section className="space-y-6">
                <div className="fixed inset-0 bg-gradient-to-br from-sky-500/5 from-[0%] via-transparent via-[55%] to-sky-500/5 to-[0%] pointer-events-none">
                    <div className="fixed inset-x-0 top-0 h-1/2 bg-gradient-to-tr from-transparent from-[0%] via-transparent via-[65%] to-sky-500/5 to-[0%] pointer-events-none"/>
                </div>
                <div className="w-full flex flex-row gap-6">
                    <div className="max-w-3xl">
                        <h1 className="mb-3 md:mb-6 font-semibold text-black dark:text-white md:text-xl">Clarity in Every Story</h1>
                        {/* <p className="mb-6 text-5xl leading-tight font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-black to-[50%] dark:to-white">Ekspresikan Dirimu Lewat Blog: Bebaskan Kreativitasmu!</p> */}
                        <p className="mb-6 md:mb-8 text-4xl md:text-5xl leading-tight md:leading-tight font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-black to-[50%] dark:to-white">Express Yourself Through Blogging: Unleash Your Creativity!</p>
                        {/* <p className="leading-7">Di dunia yang penuh dengan informasi, suara asli dan kreatif sangatlah berharga. Blog memberimu kesempatan untuk menjadi diri sendiri, mengeksplorasi minatmu, dan terhubung dengan pembaca yang tertarik dengan apa yang kamu tawarkan. Mulailah petualangan bloggingmu hari ini dan biarkan kreativitasmu bersinar!</p> */}
                        <p className="leading-7">In a world filled with information, authentic and creative voices are invaluable. A blog gives you the opportunity to be yourself, explore your interests, and connect with readers who are interested in what you have to offer. Start your blogging adventure today and let your creativity shine!</p>
                    </div>
                    <div className="hidden w-full xl:flex justify-center items-center">
                        {/* <Image src="/images/content-creation.png" width={312} height={312} alt="hero" /> */}
                        <div className="ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <SmallDemoEditor />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <TrendingUp className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Stay Updated</h6>
                                <p className="text-sm">Read the latest news from Indonesia and beyond.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <PenLine className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Build Your Own Blog</h6>
                                <p className="text-sm">Get a professionally designed, SEO-optimized website.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <PencilRuler className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Powerful Content Editor</h6>
                                <p className="text-sm">Easily manage your blog with a high-quality editor.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <Gauge className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Boost SEO Performance</h6>
                                <p className="text-sm">Get a blog that ranks well on search engines.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Template>
    );
}