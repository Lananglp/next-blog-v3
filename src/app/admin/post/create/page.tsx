"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTag from "@/components/input/input-tag";
import InputExcerpt from "@/components/input/input-excerpt";
import InputSlug from "@/components/input/input-slug";
import InputTitle from "@/components/input/input-title";
import TextEditor from "@/components/text-editor";
import InputStatus from "@/components/input/input-status";
import { Button } from "@/components/ui/button";
import { Eye, MoveLeft, Send } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import PostPreview from "./PostPreview";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputImage from "@/components/input/input-image";
import InputCategory from "@/components/input/input-category";

// export type PostFormValues = {
//     title: string;
//     content: string;
//     excerpt: string;
//     slug: string;
//     status: string;
//     categories: string[];
//     tags: string[];
//     // authorId: string;
//     // featuredImage: string;
//     commentStatus: string;
//     meta: {
//         title?: string;
//         description?: string;
//         keywords?: string[];
//         ogImage?: string;
//     };
//     // meta: Record<string, any>;
//     // postFormat: string;
//     // customFields: Record<string, any>;
// };

const postSchema = z.object({
    title: z.string().min(1, "Title is required").min(5, "Minimum 3 characters required").max(100, "The word is too long"),
    content: z.string().min(30, "Content is required"),
    excerpt: z.string().min(1, "Summary is required").min(10, "Minimum 10 characters required").max(200, "The word is too long"),
    slug: z.string().min(1, "Slug is required").min(3, "Slug is required").max(150, "The word is too long"),
    status: z.enum(["publish", "draft", "private"]),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    // authorId: z.string(),
    featuredImage: z.string().min(1, "Thumbnail is required").url(),
    commentStatus: z.enum(["open", "closed"]),
    meta: z.object({
        title: z.string().max(100, "The word is too long"),
        description: z.string().max(200, "The word is too long"),
        keywords: z.array(z.string()),
        ogImage: z.string(),
    }),
    // postFormat: z.string().optional(),
    // customFields: z.record(z.any()).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostPage() {
    const { control, handleSubmit, watch, getValues, formState: { errors } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: 'Perkembangan AI dalam Dunia Teknologi',
            content: '<h2>Apa Itu Kecerdasan Buatan?</h2><p>Kecerdasan Buatan <strong>AI</strong> adalah cabang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir dan belajar seperti manusia.</p><p>Seiring berkembangnya teknologi, AI telah banyak diterapkan dalam berbagai bidang, mulai dari kesehatan, otomotif, hingga finansial. AI mampu menganalisis data dalam jumlah besar, mengenali pola, serta membuat prediksi yang akurat.</p><h2>Manfaat AI dalam Kehidupan Sehari-hari</h2><ul><li><p><strong>Otomatisasi Tugas</strong> - AI membantu mengotomatiskan pekerjaan repetitif.</p></li><li><p><strong>Asisten Virtual</strong> - Seperti Siri, Alexa, dan Google Assistant.</p></li><li><p><strong>Keamanan</strong> - AI digunakan dalam sistem pengenalan wajah dan sidik jari.</p></li><li><p><strong>Peningkatan Efisiensi</strong> - AI membantu dalam meningkatkan produktivitas di berbagai sektor industri.</p></li><li><p><strong>Analisis Data</strong> - AI memudahkan pemrosesan dan analisis data dalam jumlah besar.</p></li></ul><figure><img src="/uploads/image/image-2025-02-17-1739765453978.jpg" alt="Ilustrasi perkembangan AI dalam berbagai sektor." title="Ilustrasi perkembangan AI dalam berbagai sektor." style="width: 100%; height: auto; object-fit: cover; aspect-ratio: auto; place-self: start;"><figcaption style="width: 100%; place-self: start; text-align: start;" class="text-zinc-600 dark:text-zinc-400 text-xs mt-2">Ilustrasi perkembangan AI dalam berbagai sektor.</figcaption></figure><h2>Teknologi AI yang Sedang Tren</h2><p>Beberapa teknologi AI yang berkembang pesat saat ini antara lain:</p><ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Machine Learning</a> - Membantu sistem untuk belajar dari data dan meningkatkan akurasi prediksi.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Natural Language Processing (NLP)</a> - Memungkinkan komputer memahami dan memproses bahasa manusia.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Computer Vision</a> - Memungkinkan komputer mengenali dan menginterpretasi gambar serta video.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">AI dalam Medis</a> - Membantu dokter dalam mendiagnosis penyakit dan memberikan perawatan yang lebih akurat.</p></li></ul><table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: left">Jenis Teknologi</p></th><th colspan="1" rowspan="1"><p style="text-align: left">Keunggulan</p></th><th colspan="1" rowspan="1"><p style="text-align: left">Penerapan</p></th></tr><tr><td colspan="1" rowspan="1"><p>Machine Learning</p></td><td colspan="1" rowspan="1"><p>Mampu belajar dari data dan meningkatkan performa.</p></td><td colspan="1" rowspan="1"><p>Rekomendasi produk, deteksi penipuan.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Natural Language Processing</p></td><td colspan="1" rowspan="1"><p>Dapat memahami dan menghasilkan bahasa manusia.</p></td><td colspan="1" rowspan="1"><p>Chatbot, penerjemahan otomatis.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Computer Vision</p></td><td colspan="1" rowspan="1"><p>Dapat mengenali dan menganalisis gambar.</p></td><td colspan="1" rowspan="1"><p>Deteksi wajah, pengawasan keamanan.</p></td></tr></tbody></table><p>ini hanya text untuk testing.</p>',
            // title: '',
            // content: '',
            excerpt: 'Apa Itu Kecerdasan Buatan?Kecerdasan Buatan AI adalah cabang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir dan belajar seperti...',
            slug: 'perkembangan-ai-dalam-dunia-teknologi',
            tags: ['teknologi', 'ai', 'dunia maya'],
            categories: ['teknologi', 'nasional'],
            status: 'draft',
            // authorId: '1',
            // featuredImage: '/uploads/image/image-2025-02-17-1739765453978.jpg',
            featuredImage: '',
            commentStatus: 'open',
            meta: {
                title: '',
                description: '',
                keywords: [],
                ogImage: '',
            },
            // postFormat: 'standard',
            // customFields: {},
        }
    });
    const title = watch('title');
    const slug = watch('slug');
    const tags = watch('tags');
    const content = watch("content");
    const excerpt = watch("excerpt");
    const categories = watch("categories");
    const featuredImage = watch("featuredImage");
    const status = watch("status");
    const meta = watch("meta");
    const { setOpen } = useSidebar();
    const [preview, setPreview] = useState<boolean>(false);
    const [toogleDevTool, setToogleDevTool] = useState<boolean>(false);
    const [customSeo, setCustomSeo] = useState<boolean>(false);

    const handleHideSidebar = () => {
        setOpen(false);
    }

    useEffect(() => {
        let ignored = false;

        if (!ignored) {
            handleHideSidebar();
        }

        return () => {
            ignored = true;
        };
    }, []);

    const onSubmit: SubmitHandler<PostFormValues> = (data) => {
        console.log(data);
    };

    if (!preview) {
        return (
            <div className="max-w-3xl mx-auto pt-12 pb-24">
                <h2 className="text-black dark:text-white text-xl font-semibold border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-4">Create New Post</h2>
                <img src="http://localhost:3000/api/uploads/image-2025-02-19-1739938423932.png" alt="" />
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
                    <div>
                        <InputImage
                            label="Post Thumbnail"
                            name="featuredImage"
                            value={featuredImage}
                            control={control}
                            errors={errors.featuredImage}
                            placeholder="Enter the post title"
                            required
                        />
                    </div>
                    <InputTitle
                        type="heading"
                        label="Post Title"
                        value={title}
                        name="title"
                        control={control}
                        errors={errors.title}
                        placeholder="Enter the post title"
                        maxWords={100}
                        required
                    />
                    <TextEditor
                        name="content"
                        control={control}
                        errors={errors.content}
                    />
                    <InputExcerpt
                        value={excerpt}
                        content={content}
                        name="excerpt"
                        control={control}
                        errors={errors.excerpt}
                        placeholder="Enter a post summary"
                    />
                    <InputSlug
                        value={slug}
                        name="slug"
                        control={control}
                        placeholder="Enter slug..."
                        title={title}
                        errors={errors.slug}
                    />
                    <InputCategory
                        value={categories}
                        name="categories"
                        control={control}
                        placeholder="Select categories"
                        errors={errors.categories}
                    />
                    <InputTag
                        label="Tags"
                        value={tags}
                        name="tags"
                        control={control}
                        placeholder="Enter tags..."
                        errors={errors.tags}
                    />
                    <div className="py-4">
                        <div className="border-b border-zinc-300 dark:border-zinc-800 pb-4 mb-4">
                            <div className="flex items-center space-x-2 mt-2 mb-4">
                                <Switch checked={customSeo} onCheckedChange={(value) => setCustomSeo(value)} id="devtool" />
                                <Label htmlFor="devtool">Customize SEO</Label>
                            </div>
                            {customSeo ? (
                                <p className="text-sm">Adjust SEO settings to improve content visibility. Enter an SEO title, set post status, and manage additional options as needed.</p>
                            ) : (
                                <p className="text-sm">SEO is automatically filled in, activate customize SEO if you want to make adjustments manually.</p>
                            )}
                        </div>
                        {customSeo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <InputTitle
                                    type="text"
                                    label="Meta Title"
                                    value={meta.title}
                                    name="meta.title"
                                    control={control}
                                    errors={errors.meta?.title}
                                    placeholder="Enter meta title"
                                    note="The title that appears in search engine results (50-60 characters recommended)"
                                    disableWordCount
                                />
                                <InputTitle
                                    type="text"
                                    label="Meta Description"
                                    value={meta.description}
                                    name="meta.description"
                                    control={control}
                                    errors={errors.meta?.description}
                                    placeholder="Enter meta description"
                                    note="A brief description of the post for search engines (150-160 characters recommended)"
                                    disableWordCount
                                />
                                <InputTag
                                    label="Meta Keywords"
                                    value={meta.keywords}
                                    name="meta.keywords"
                                    control={control}
                                    placeholder="Enter keywords..."
                                    errors={errors.meta?.keywords}
                                />
                                <Controller
                                    name="meta.ogImage"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <div>
                                                <Label htmlFor="ogImage" className="inline-block mb-2">Image URL :</Label>
                                                <Input
                                                    type="url"
                                                    variant={'primary'}
                                                    placeholder="Enter image URL..."
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                                <p className="mt-2 mx-0.5 text-xs text-zinc-500">The image that appears when sharing on social media (recommended size: 1200x630 pixels)</p>
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <Controller
                        name="commentStatus"
                        control={control}
                        render={({field}) => {
                            return (
                                <div className="flex items-center space-x-2">
                                    <Switch checked={field.value === 'open'} onCheckedChange={(value) => field.onChange(value ? 'open' : 'closed')} id="commentStatus" />
                                    <Label htmlFor="commentStatus">Comment</Label>
                                </div>
                            )
                        }}
                    />
                    <div className="flex justify-between items-end gap-2">
                        <InputStatus
                            name="status"
                            control={control}
                            errors={errors.status}
                        />
                        <div className="flex items-center gap-2">
                            <Button type="submit" variant={'submit'}><Send />Create Post</Button>
                            <Button type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'} className="flex md:hidden h-10 w-10"><Eye /></Button>
                        </div>
                    </div>
                </form>
                <div className="mt-4">
                    <Label className="mb-2">other settings :</Label>
                    <div className="flex items-center space-x-2 mt-2 mb-4">
                        <Switch checked={toogleDevTool} onCheckedChange={(value) => setToogleDevTool(value)} id="devtool" />
                        <Label htmlFor="devtool">Developer tools</Label>
                    </div>
                    {toogleDevTool && (
                        <div>
                            <p className="mb-2">Content Output:</p>
                            <div className="border border-zinc-300 dark:border-zinc-800 rounded-lg bg-zinc-200/50 dark:bg-zinc-900/50 p-4">
                                {content}
                            </div>
                        </div>    
                    )}
                </div>
                <Button type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'} className="hidden md:flex fixed bottom-4 right-4"><Eye />Preview</Button>
            </div>
        );   
    } else {
        return (
            <>
                <PostPreview value={getValues()} />
                <div className="sticky bottom-4 flex justify-end mt-12">
                    <Button type="button" onClick={() => setPreview(false)} variant={'editorBlockBar'}><MoveLeft />Back to Editor</Button>
                </div>
            </>
            // <div className="max-w-3xl mx-auto pt-12 pb-24">
            //     <div className="min-h-[calc(100vh-13rem)] flex flex-col">
            //         <div className="flex-grow">
            //             <h2 className="text-xl font-semibold border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-4">
            //                 <AlertDialog>
            //                     <AlertDialogTrigger asChild>
            //                         <Button variant="ghost" size={'xs'}><CircleAlert className="text-orange-500 inline h-4 w-4" /></Button>
            //                     </AlertDialogTrigger>
            //                     <AlertDialogContent>
            //                         <AlertDialogHeader>
            //                             <AlertDialogTitle>Information</AlertDialogTitle>
            //                             <AlertDialogDescription>
            //                                 This is just a post preview, your post will not be visible to users before you publish it.
            //                             </AlertDialogDescription>
            //                         </AlertDialogHeader>
            //                         <AlertDialogFooter>
            //                             <AlertDialogAction>I understand</AlertDialogAction>
            //                         </AlertDialogFooter>
            //                     </AlertDialogContent>
            //                 </AlertDialog>
            //                 Preview Mode
            //             </h2>
            //             <PostPreview value={getValues()} />
            //         </div>
            //         <div className="flex justify-end mt-12">
            //             <Button type="button" onClick={() => setPreview(false)} variant={'editorBlockBar'}><MoveLeft />Back to Editor</Button>
            //         </div>
            //     </div>
            // </div>
        )
    }
}
