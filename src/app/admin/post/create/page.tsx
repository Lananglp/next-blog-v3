"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTag from "./InputTag";
import InputExcerpt from "./InputExcerpt";
import InputSlug from "./InputSlug";
import InputTitle from "./InputTitle";
import InputCategory from "./InputCategory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux";
import { setPostPreview } from "@/context/postPreviewSlice";
import TextEditor from "@/components/text-editor";
import InputStatus from "./InputStatus";
import { Button } from "@/components/ui/button";
import { CircleAlert, Eye, EyeClosed, MoveLeft, Send } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import PostPreview from "./PostPreview";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const postSchema = z.object({
    title: z.string().min(1, "Title is required").min(5, "Minimum 3 characters required").max(150, "The word is too long"),
    content: z.string().min(30, "Content is required"),
    excerpt: z.string().min(1, "Summary is required").min(10, "Minimum 10 characters required").max(200, "The word is too long"),
    slug: z.string().min(1, "Slug is required").min(3, "Slug is required").max(150, "The word is too long"),
    status: z.enum(["publish", "draft", "private"]),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    // authorId: z.string(),
    // featuredImage: z.string().optional(),
    commentStatus: z.enum(["open", "closed"]),
    // meta: z.record(z.any()).optional(),
    // postFormat: z.string().optional(),
    // customFields: z.record(z.any()).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostPage() {
    const { control, handleSubmit, watch, getValues, formState: { errors } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: 'Orang hebat akan selalu melakukan kebaikan demi dirinya serta akan tetap berada di dalam hal baik',
            content: '<p>Di sebuah <em>pulau</em> terdapat orang yang <strong>sangat baik</strong>, setiap hari dia melakukan <u>hal yang luar biasa</u> seperti ngoding, kerauhan dan memandikan batu. dia setiap hari selalu melakukan update <mark>system</mark> yang bertujuan untuk <s>meningkatkan kualitas</s> dalam hidupnya, sungguh luar biasa tiada tanding orang ini, dari kejadian ini kita bisa tahu bahwa orang baik akan tetap berada <span style="color: #2c2cf2">kebaikan</span> yang ada, berikut hal yang dilakukan orang baik:</p><p></p><ol><li><p>Tidak memakai topi bodoh</p></li><li><p>selalu taat melakukan hal yang baik</p></li><li><p>Tidak menyalakan api saat ada air</p></li></ol><p></p><p>itulah yang dapat disampaikan semasih beliau sedang aktif melakukan kebaikan namun saat ini dia dikatakan sudah menjadi jahat karena kejahatan yang ada saat 300 tahun masehi sebelumnya.</p>',
            // title: '',
            // content: '',
            excerpt: '',
            slug: '',
            tags: [],
            categories: [],
            status: 'draft',
            // authorId: '1',
            // featuredImage: '',
            commentStatus: 'open',
            // meta: {},
            // postFormat: 'standard',
            // customFields: {},
        }
    });
    const { post } = useSelector((state: RootState) => state.postPreview);
    const dispatch = useDispatch();
    const title = watch('title');
    const slug = watch('slug');
    const tags = watch('tags');
    const content = watch("content");
    const excerpt = watch("excerpt");
    const categories = watch("categories");
    const status = watch("status");
    const { setOpen } = useSidebar();
    const [preview, setPreview] = useState<boolean>(false);

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

    const handleSetPreview = (data: PostFormValues) => {
        dispatch(setPostPreview(data));
    };

    const onSubmit: SubmitHandler<PostFormValues> = (data) => {
        handleSetPreview(data);
    };

    if (!preview) {
        return (
            <div className="max-w-3xl mx-auto pt-12 pb-24">
                <h2 className="text-xl font-semibold border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-4">Create New Post</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputTitle
                        value={title}
                        name="title"
                        control={control}
                        errors={errors.title}
                        placeholder="Enter the post title"
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
                    {/* <input {...register("authorId")} placeholder="Author ID" className="w-full bg-transparent py-1 px-2 border border-zinc-800" /> */}
                    <InputCategory
                        value={categories}
                        name="categories"
                        control={control}
                        placeholder="Select categories"
                        errors={errors.categories}
                    />
                    <InputTag
                        value={tags}
                        name="tags"
                        control={control}
                        placeholder="Enter tags..."
                        errors={errors.tags}
                    />
                    <Controller
                        name="commentStatus"
                        control={control}
                        render={({field}) => {
                            return (
                                <div className="flex items-center space-x-2">
                                    <Switch checked={field.value === 'open'} onCheckedChange={(value) => field.onChange(value ? 'open' : 'closed')} id="airplane-mode" />
                                    <Label htmlFor="airplane-mode">Comment</Label>
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
                            <Button type="button" onClick={() => setPreview(true)} variant={'editorBlockBar'}><Eye />Preview</Button>
                        </div>
                    </div>
                    {/* <input {...register("featuredImage")} placeholder="Featured Image URL" className="w-full bg-transparent py-1 px-2 border border-zinc-800" /> */}

                    {/* <select {...register("commentStatus")} className="w-full bg-transparent py-1 px-2 border border-zinc-800">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select> */}
                </form>
            </div>
        );   
    } else {
        return (
            <div className="max-w-3xl mx-auto pt-12 pb-24">
                <div className="min-h-[calc(100vh-13rem)] flex flex-col">
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size={'xs'}><CircleAlert className="text-orange-500 inline h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Information</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This is just a post preview, your post will not be visible to users before you publish it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction>I understand</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            Preview Mode
                        </h2>
                        <PostPreview value={getValues()} />
                    </div>
                    <div className="flex justify-end mt-12">
                        <Button type="button" onClick={() => setPreview(false)} variant={'editorBlockBar'}><MoveLeft />Back to Editor</Button>
                    </div>
                </div>
            </div>
        )
    }
}
