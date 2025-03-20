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
import { useState, useEffect } from "react";
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
import { postEdit, postPost } from "@/app/api/function/posts";
import { AxiosError } from "axios";
import { responseStatus } from "@/helper/system-config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PostPreview from "../../PostPreview";
import { PostType } from "@/types/post-type";

export default function PostEdit({ pageTitle, post }: { pageTitle: string, post: PostType }) {
    const [submitModal, setSubmitModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [sarkasDetail, setSarkasDetail] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.session);
    const navigate = useRouter();
    const { toast } = useToast();

    const dispatch = useDispatch();

    const setPageTitle = () => {
        dispatch(setTitle(pageTitle));
    }

    useSingleEffect(() => {
        setPageTitle();
    });

    const { control, handleSubmit, watch, getValues, formState: { errors, isDirty } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            id: post.id || "",
            title: post.title || "",
            content: post.content || "",
            excerpt: post.excerpt || "",
            slug: post.slug || "",
            status: post.status as "PUBLISH" | "DRAFT" | "PRIVATE" || "DRAFT",
            categories: post.categories.map((cat) => cat.name) || [],
            tags: post.tags || [],
            featuredImage: post.featuredImage || "",
            altText: post.altText || "",
            authorId: post.authorId || "",
            commentStatus: post.commentStatus as "OPEN" | "CLOSED" || "OPEN",
            meta: {
                title: post.meta.title || "",
                description: post.meta.description || "",
                keywords: post.meta.keywords || [],
                ogImage: post.meta.ogImage || "",
            },
        }
    });

    // PENTING
    // console.log(errors);

    const title = watch('title');
    const content = watch("content");
    const excerpt = watch("excerpt");
    const slug = watch('slug');
    const status = watch("status");
    const categories = watch("categories");
    const tags = watch('tags');
    const featuredImage = watch("featuredImage");
    const altText = watch("altText");
    const meta = watch("meta");
    const [preview, setPreview] = useState<boolean>(false);
    const [toogleDevTool, setToogleDevTool] = useState<boolean>(false);
    const [customSeo, setCustomSeo] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Untuk browser lama
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleStateOpenSubmitModal = (value: boolean) => {
        setSubmitModal(value);
        setSarkasDetail(false);
    }

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
        setSubmitModal(false);
    };

    const onSubmit: SubmitHandler<PostFormValues> = async (data, event) => {
        event?.preventDefault();
        setLoading(true);

        const formdata = new FormData();
        formdata.append("id", data.id || '');
        formdata.append("authorId", user.id.toString());
        formdata.append("title", data.title);
        formdata.append("content", data.content);
        formdata.append("excerpt", data.excerpt);
        formdata.append("slug", data.slug);
        formdata.append("tags", JSON.stringify(data.tags));
        formdata.append("categories", JSON.stringify(data.categories));
        formdata.append("status", data.status);
        formdata.append("commentStatus", data.commentStatus);
        formdata.append("meta", JSON.stringify({
            title: data.meta.title ? data.meta.title : data.title,
            description: data.meta.description ? data.meta.description : data.excerpt,
            keywords: data.meta.keywords.length > 0 ? data.meta.keywords : data.tags,
            ogImage: data.meta.ogImage ? data.meta.ogImage : data.featuredImage
        }));
        formdata.append("featuredImage", data.featuredImage);
        formdata.append("altText", data.altText);

        try {
            const res = await postEdit(formdata);
            if (res.data?.status) {
                toast({
                    title: res.data.status,
                    description: res.data.message,
                });
                navigate.push("/admin/posts");
            };
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("AxiosError: ", error.response);
                if (error.response?.data.status) {
                    toast({
                        title: responseStatus.warning,
                        description: `${error.response?.data.message}. (${error.response?.status.toString()})` || "an error occurred",
                    })
                }
            } else {
                console.log("Unknown error: ", error);
            }
        } finally {
            setLoading(false);
        }
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
                    <div className="space-y-4">
                        <div className="hidden lg:flex justify-between items-end gap-2">
                            <InputStatus
                                name="status"
                                control={control}
                                errors={errors.status}
                            />
                            <div className="flex-1 lg:flex-none lg:flex items-center gap-2">
                                <Button title="Preview" type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'} className="w-full"><Eye /> <span className="hidden xl:inline">Preview</span></Button>
                                <Button title="Update Post" type="button" onClick={() => setSubmitModal(true)} variant={'submit'} className="w-full"><Send /><span className="hidden xl:inline">Update Post</span></Button>
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
                            type="text"
                            size="sm"
                            label="Alt Text"
                            value={altText}
                            name="altText"
                            control={control}
                            errors={errors.altText}
                            placeholder="The alt text for the post thumbnail"
                            disableWordCount
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
                                        <Switch checked={field.value === 'OPEN'} onCheckedChange={(value) => field.onChange(value ? 'OPEN' : 'CLOSED')} id="commentStatus" />
                                        <Label htmlFor="commentStatus">Comment</Label>
                                    </div>
                                )
                            }}
                        />
                        <div className="flex flex-wrap justify-between items-end gap-2 mb-4">
                            <InputStatus
                                name="status"
                                control={control}
                                errors={errors.status}
                            />
                            <div className="flex items-center gap-2">
                                <Button title="Preview" type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'}><Eye /> Preview</Button>
                                <Button title="Update Post" type="button" onClick={() => setSubmitModal(true)} variant={'submit'}><Send />Update Post</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertDialog open={submitModal} onOpenChange={(value) => handleStateOpenSubmitModal(value)}>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader className="hidden">
                            <AlertDialogTitle>{loading ? 'Please wait...' : 'Ready to Publish?'}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {loading ? 'Processing your post, please wait a moment.' : 'Are you sure you want to publish this post?'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {loading ? (
                            <div className="h-64 flex justify-center items-center">
                                <div className="typewriter">
                                    <div className="slide"><i /></div>
                                    <div className="paper" />
                                    <div className="keyboard" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="mb-1">The current status of your post is:</p>
                                    <h4 className={`
                                            text-xl font-semibold
                                            ${getValues().status === 'PUBLISH'
                                            ? 'text-green-300'
                                            : getValues().status === 'PRIVATE'
                                                ? 'text-red-300'
                                                : 'text-black dark:text-white'}
                                        `}
                                    >{getValues().status}</h4>
                                </div>
                                <div className="bg-zinc-200/50 dark:bg-zinc-900/50 text-sm rounded-lg px-4 leading-6 py-3">
                                    {getValues().status === 'DRAFT' && (
                                        <p className="text-black dark:text-white font-semibold">
                                            Your post is currently in draft mode and not yet visible to others.
                                        </p>
                                    )}
                                    {getValues().status === 'PUBLISH' && (
                                        <p className="text-black dark:text-white font-semibold">
                                            Your post will be publicly visible to all users.
                                        </p>
                                    )}
                                    {getValues().status === 'PRIVATE' && (
                                        <p className="text-black dark:text-white font-semibold">
                                            Your post is set to private and will only be accessible to you.
                                        </p>
                                    )}
                                    <p onClick={() => setSarkasDetail(!sarkasDetail)} className={`mt-2 text-zinc-500 cursor-pointer ${!sarkasDetail && 'line-clamp-2'}`}>
                                        Please ensure that your content adheres to ethical and community guidelines. Avoid including any elements related to ethnicity, religion, race, or intergroup relations that may be deemed offensive. Always use respectful, clear, and appropriate language in accordance with applicable norms.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button title="Close" type="button" onClick={() => handleStateOpenSubmitModal(false)} variant={'primary'} className="w-full"><MoveLeft />back</Button>
                                    <Button title="Update Post" type="button" onClick={handleClickSubmit} variant={'submit'} className="w-full"><Send />{getValues().status.toUpperCase()}</Button>
                                </div>
                            </div>
                        )}
                    </AlertDialogContent>
                </AlertDialog>
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