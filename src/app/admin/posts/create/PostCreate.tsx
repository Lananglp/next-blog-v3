"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import { useState } from "react";
import PostPreview from "./PostPreview";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputImage from "@/components/input/input-image";
import InputCategory from "@/components/input/input-category";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "@/context/titleSlice";
import { useSingleEffect } from "react-haiku";
import { PostFormValues, postSchema } from "@/helper/schema/schema";
import { RootState } from "@/lib/redux";

export default function PostCreate({ pageTitle }: { pageTitle: string }) {
    const { user } = useSelector((state: RootState) => state.session);
    const dispatch = useDispatch();

    const setPageTitle = () => {
        dispatch(setTitle(pageTitle));
    }

    useSingleEffect(() => {
        setPageTitle();
    });

    const { control, handleSubmit, watch, getValues, formState: { errors } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            // featuredImage: '/uploads/image/image-2025-02-17-1739765453978.jpg',
            // title: 'Perkembangan AI dalam Dunia Teknologi',
            // content: '<h2>Apa Itu Kecerdasan Buatan?</h2><p>Kecerdasan Buatan <strong>AI</strong> adalah cabang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir dan belajar seperti manusia.</p><p>Seiring berkembangnya teknologi, AI telah banyak diterapkan dalam berbagai bidang, mulai dari kesehatan, otomotif, hingga finansial. AI mampu menganalisis data dalam jumlah besar, mengenali pola, serta membuat prediksi yang akurat.</p><h2>Manfaat AI dalam Kehidupan Sehari-hari</h2><ul><li><p><strong>Otomatisasi Tugas</strong> - AI membantu mengotomatiskan pekerjaan repetitif.</p></li><li><p><strong>Asisten Virtual</strong> - Seperti Siri, Alexa, dan Google Assistant.</p></li><li><p><strong>Keamanan</strong> - AI digunakan dalam sistem pengenalan wajah dan sidik jari.</p></li><li><p><strong>Peningkatan Efisiensi</strong> - AI membantu dalam meningkatkan produktivitas di berbagai sektor industri.</p></li><li><p><strong>Analisis Data</strong> - AI memudahkan pemrosesan dan analisis data dalam jumlah besar.</p></li></ul><figure><img src="/uploads/image/image-2025-02-17-1739765453978.jpg" alt="Ilustrasi perkembangan AI dalam berbagai sektor." title="Ilustrasi perkembangan AI dalam berbagai sektor." style="width: 100%; height: auto; object-fit: cover; aspect-ratio: auto; place-self: start;"><figcaption style="width: 100%; place-self: start; text-align: start;" class="text-zinc-600 dark:text-zinc-400 text-xs mt-2">Ilustrasi perkembangan AI dalam berbagai sektor.</figcaption></figure><h2>Teknologi AI yang Sedang Tren</h2><p>Beberapa teknologi AI yang berkembang pesat saat ini antara lain:</p><ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Machine Learning</a> - Membantu sistem untuk belajar dari data dan meningkatkan akurasi prediksi.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Natural Language Processing (NLP)</a> - Memungkinkan komputer memahami dan memproses bahasa manusia.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">Computer Vision</a> - Memungkinkan komputer mengenali dan menginterpretasi gambar serta video.</p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="test">AI dalam Medis</a> - Membantu dokter dalam mendiagnosis penyakit dan memberikan perawatan yang lebih akurat.</p></li></ul><table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: left">Jenis Teknologi</p></th><th colspan="1" rowspan="1"><p style="text-align: left">Keunggulan</p></th><th colspan="1" rowspan="1"><p style="text-align: left">Penerapan</p></th></tr><tr><td colspan="1" rowspan="1"><p>Machine Learning</p></td><td colspan="1" rowspan="1"><p>Mampu belajar dari data dan meningkatkan performa.</p></td><td colspan="1" rowspan="1"><p>Rekomendasi produk, deteksi penipuan.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Natural Language Processing</p></td><td colspan="1" rowspan="1"><p>Dapat memahami dan menghasilkan bahasa manusia.</p></td><td colspan="1" rowspan="1"><p>Chatbot, penerjemahan otomatis.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Computer Vision</p></td><td colspan="1" rowspan="1"><p>Dapat mengenali dan menganalisis gambar.</p></td><td colspan="1" rowspan="1"><p>Deteksi wajah, pengawasan keamanan.</p></td></tr></tbody></table><p>ini hanya text untuk testing.</p>',
            // excerpt: 'Apa Itu Kecerdasan Buatan?Kecerdasan Buatan AI adalah cabang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir dan belajar seperti...',
            // slug: 'perkembangan-ai-dalam-dunia-teknologi',
            // tags: ['teknologi', 'ai', 'dunia maya'],
            // categories: ['teknologi', 'nasional'],
            // status: 'draft',
            featuredImage: '',
            title: '',
            content: '',
            excerpt: '',
            slug: '',
            tags: [],
            categories: [],
            status: 'draft',
            commentStatus: 'open',
            meta: {
                title: '',
                description: '',
                keywords: [],
                ogImage: '',
            },
            authorId: user.id,
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
    const [preview, setPreview] = useState<boolean>(false);
    const [toogleDevTool, setToogleDevTool] = useState<boolean>(false);
    const [customSeo, setCustomSeo] = useState<boolean>(false);

    const onSubmit: SubmitHandler<PostFormValues> = (data) => {
        console.log(data);
    };

    if (!preview) {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-8 gap-4">
                <div className="col-span-8 lg:col-span-5">
                    <div className="space-y-4">
                        <TextEditor
                            name="content"
                            control={control}
                            errors={errors.content}
                        />
                        <div>
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
                    </div>
                </div>
                <div className="col-span-8 lg:col-span-3">
                    <div className="sticky top-4 space-y-4">
                        <div className="hidden lg:flex flex-wrap justify-between items-end gap-2">
                            <InputStatus
                                name="status"
                                control={control}
                                errors={errors.status}
                            />
                            <div className="flex items-center gap-2">
                                <Button title="Create Post" type="submit" variant={'submit'}><Send />Create Post</Button>
                                <Button title="Preview" type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'} className="h-10 w-10"><Eye /></Button>
                            </div>
                        </div>
                        <InputImage
                            label="Post Thumbnail"
                            name="featuredImage"
                            value={featuredImage}
                            control={control}
                            errors={errors.featuredImage}
                            placeholder="Enter the post title"
                            required
                        />
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
                                <div className="grid grid-cols-1 gap-2">
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
                            render={({ field }) => {
                                return (
                                    <div className="flex items-center space-x-2">
                                        <Switch checked={field.value === 'open'} onCheckedChange={(value) => field.onChange(value ? 'open' : 'closed')} id="commentStatus" />
                                        <Label htmlFor="commentStatus">Comment</Label>
                                    </div>
                                )
                            }}
                        />
                        <div className="lg:hidden flex flex-wrap justify-between items-end gap-2 mb-4">
                            <InputStatus
                                name="status"
                                control={control}
                                errors={errors.status}
                            />
                            <div className="flex items-center gap-2">
                                <Button title="Create Post" type="submit" variant={'submit'}><Send />Create Post</Button>
                                <Button title="Preview" type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'} className="h-10 w-10"><Eye /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    } else {
        return (
            <>
                <PostPreview value={getValues()} />
                <div className="sticky bottom-4 flex justify-end mt-12">
                    <Button type="button" onClick={() => setPreview(false)} variant={'primary'}><MoveLeft />Back to Editor</Button>
                </div>
            </>
        )
    }
}
