'use client'
import EditorAlign from "@/components/editor/editor-align";
import EditorMarkOne from "@/components/editor/editor-mark-one";
import EditorTextTypeDropdown from "@/components/editor/editor-text-type-dropdown";
import EditorUndoRedo from "@/components/editor/editor-undo-redo";
import Template from "@/components/template-custom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CrownIcon, Gauge, LoaderIcon, MessageCircleMore, PencilRuler, PenLine, SparklesIcon, Terminal, TrendingUp, WrenchIcon } from "lucide-react";
import Image from "next/image";

const SmallDemoEditor = () => {

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Underline],
        content: '<h2>Start expressing your ideas here</h2><p><strong>Expressing ideas</strong> is crucial for innovation, problem-solving, and growth. It allows individuals to share <em>knowledge</em>, inspire others, and <u>contribute to progress</u>.</p>',
    })
    // const value = editor?.getHTML();

    return (
        // <div className="max-w-96 md:max-w-[456px]">
        <div className="h-full">
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
                <div className="overflow-x-auto flex items-center gap-1 p-2">
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

    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <Template gradient>
            <Alert className='mb-4'>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You&apos;re on the home page but this page is still in maintenance.
                </AlertDescription>
            </Alert>
            <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="max-w-3xl space-y-4">
                        <div>
                            <div className="text-5xl md:text-6xl leading-tight md:leading-tight font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-700 dark:from-sky-300 to-black to-[50%] dark:to-white">{appName}</div>
                            <p className="leading-7">{appName} merupakan partner bisnis anda untuk perusahaan <br className="hidden md:inline" /> yang membutuhkan sebuah website.</p>
                        </div>
                        <blockquote className="relative">
                            <div className="absolute inset-y-0 w-0.5 bg-sky-500 rounded-xl" />
                            <div className="ps-6 pe-4 py-4 text-sm leading-6">
                                &quot; Di era digital, website bukan sekadar identitas—ia adalah pintu gerbang utama bisnis Anda. Tanpa website, perusahaan hanyalah bayangan di tengah lautan pesaing yang terus bergerak maju. &quot;
                            </div>
                        </blockquote>
                        {/* <p className="text-sm">Mari rencanakan ide bisnis website anda bersama kami <br className="hidden md:inline" /> dengan menghubungi kami melalui tautan berikut.</p> */}
                        {/* <button type="button" className="inline-flex items-center justify-center rounded-md border border-sky-400 px-5 py-1 text-base text-white hover:bg-sky-600"><MessageCircleMore className="h-4 w-4 mb-0.5 me-1" />Hubungi Kami</button> */}
                    </div>
                    {/* <div className="hidden w-full xl:flex justify-center items-center"> */}
                    {/* <div className="ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                        <div className="h-full bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                            <SmallDemoEditor />
                        </div>
                    </div> */}
                    <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                        <div className="flex flex-row xl:flex-col gap-x-4 md:gap-x-6 h-full p-4 md:p-6 lg:p-8 bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                            {/* <div className="mb-2 mt-1 xl:mt-0">
                                <CrownIcon className="text-sky-300" />
                            </div> */}
                            <div className="space-y-6">
                                <h6 className="text-xl md:text-3xl font-semibold text-black dark:text-sky-100">Anda salah satu dari mereka yang ingin membangun website?</h6>
                                <p className="text-sm leading-6">Ini saat yang tepat untuk membangun website Anda, dengan {appName} Anda dapat membangun website profesional yang tidak hanya menarik, tetapi juga fungsional dan efektif dalam meningkatkan kredibilitas bisnis Anda.</p>
                                <Button type="button" variant={'primary'}><MessageCircleMore />Hubungi Kami</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-8 md:pt-0">
                    <h6 className="text-xl text-center md:text-start font-semibold text-black dark:text-sky-100">Apa saja layanan website <br className="inline md:hidden" /> yang kami tawarkan?</h6>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div>
                        <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                                <div className="mb-2 mt-1 xl:mt-0">
                                    <SparklesIcon className="text-sky-300" />
                                </div>
                                <div>
                                    <h6 className="mb-2 font-semibold text-black dark:text-sky-100">Company Profile</h6>
                                    <p className="text-sm">Tingkatkan kredibilitas bisnis Anda dengan website company profile yang elegan, informatif, dan meyakinkan. Citra profesional, kepercayaan pelanggan meningkat!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                                <div className="mb-2 mt-1 xl:mt-0">
                                    <SparklesIcon className="text-sky-300" />
                                </div>
                                <div>
                                    <h6 className="mb-2 font-semibold text-black dark:text-sky-100">Landing Page</h6>
                                    <p className="text-sm">Landing page yang dirancang untuk satu tujuan: konversi! Jadikan setiap pengunjung sebagai pelanggan dengan desain yang strategis dan CTA yang kuat.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                                <div className="mb-2 mt-1 xl:mt-0">
                                    <SparklesIcon className="text-sky-300" />
                                </div>
                                <div>
                                    <h6 className="mb-2 font-semibold text-black dark:text-sky-100">Blog / Artikel</h6>
                                    <p className="text-sm">Bangun otoritas dan jangkau lebih banyak audiens dengan blog yang menarik. Artikel SEO-friendly yang siap meningkatkan visibilitas bisnis Anda!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full md:ps-[1px] md:pt-[1px] md:bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="flex flex-row xl:flex-col gap-x-6 h-full p-4 md:p-6 bg-white dark:bg-zinc-950 md:bg-transparent md:bg-gradient-to-br from-zinc-100 dark:from-zinc-900/90 from-[0%] to-white/25 dark:to-zinc-950 to-[100%] rounded-lg">
                                <div className="mb-2 mt-1 xl:mt-0">
                                    <SparklesIcon className="text-sky-300" />
                                </div>
                                <div>
                                    <h6 className="mb-2 font-semibold text-black dark:text-sky-100">Custom</h6>
                                    <p className="text-sm">Punya ide unik untuk website? Kami siap mewujudkannya! Solusi tailor-made yang sesuai dengan kebutuhan dan visi bisnis Anda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-12">
                    <h6 className="text-2xl md:text-4xl lg:text-5xl text-center font-semibold text-black dark:text-sky-100">Mengapa anda harus memilih kami?</h6>
                </div>
            </section>
        </Template>
    );
}