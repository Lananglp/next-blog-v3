'use client'
import { formatDateTime } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import '@/app/text-editor-preview.scss';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// import InputComment from '@/components/input/input-comment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronDown, ChevronUp, MessageCircle, PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import InputComment from '@/components/input/input-comment';

type Props = {
    post: PostType;
};

function PostShow({ post }: Props) {
// function PostShow() {

    // const post = {
    //     id: "489b79c8-7ea3-4687-93cf-a20b2f6e7df2",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     title: "Perkembangan Dunia IT Programming dan Teknologi di Era Digital",
    //     content: `<p><strong>Perkembangan Dunia IT Programming dan Teknologi di Era Digital</strong></p><p>Dunia IT Programming dan teknologi terus berkembang dengan pesat seiring dengan kemajuan zaman. Inovasi dalam bidang teknologi telah mengubah berbagai aspek kehidupan manusia, dari cara bekerja, berkomunikasi, hingga bagaimana kita mengakses informasi. Berikut adalah beberapa tren dan perkembangan terbaru dalam dunia IT Programming dan teknologi.</p><h3>1. <strong>Kecerdasan Buatan (AI) dan Pembelajaran Mesin (Machine Learning)</strong></h3><p>Kecerdasan buatan (AI) semakin banyak digunakan dalam berbagai bidang, termasuk pengenalan suara, analisis data, dan otomatisasi proses bisnis. Teknologi ini memungkinkan sistem untuk belajar dari data dan meningkatkan kinerjanya tanpa harus diprogram ulang. Model AI seperti GPT, Llama, dan DeepSeek semakin canggih dalam memahami bahasa manusia dan digunakan dalam berbagai aplikasi chatbot, analisis data, dan pengambilan keputusan.</p><h3>2. <strong>Pengembangan Web Modern dengan Framework Terbaru</strong></h3><p>Dunia pengembangan web juga mengalami evolusi dengan hadirnya berbagai framework modern seperti Next.js, Remix, dan Astro. Framework ini menawarkan fitur seperti static site generation (SSG), server-side rendering (SSR), dan kemampuan optimasi yang lebih baik untuk performa website. Penggunaan TypeScript dalam pengembangan juga semakin populer karena keunggulannya dalam meningkatkan keandalan kode.</p><h3>3. <strong>Blockchain dan Web3</strong></h3><p>Teknologi blockchain terus berkembang dengan adanya konsep Web3 yang berfokus pada desentralisasi internet. Konsep ini memungkinkan pengguna untuk memiliki kendali penuh atas data mereka dan menghilangkan ketergantungan pada platform terpusat. Aplikasi seperti smart contract dan decentralized finance (DeFi) menjadi semakin populer dalam ekosistem blockchain.</p><h3>4. <strong>Keamanan Siber (Cybersecurity)</strong></h3><p>Dengan semakin banyaknya data yang disimpan secara digital, keamanan siber menjadi perhatian utama. Serangan siber seperti ransomware dan phishing semakin canggih, sehingga perusahaan dan individu perlu menerapkan langkah-langkah keamanan yang lebih ketat, seperti penggunaan autentikasi multi-faktor (MFA) dan enkripsi data.</p><h3>5. <strong>Komputasi Awan (Cloud Computing)</strong></h3><p>Cloud computing telah menjadi solusi utama bagi perusahaan dalam menyimpan dan mengelola data mereka. Layanan seperti AWS, Google Cloud, dan Microsoft Azure memungkinkan bisnis untuk menjalankan aplikasi secara fleksibel tanpa harus memiliki infrastruktur fisik yang besar. Konsep serverless computing juga semakin diminati karena memungkinkan pengembang untuk fokus pada penulisan kode tanpa perlu khawatir tentang pengelolaan server.</p><h3>6. <strong>Pengembangan Aplikasi Mobile</strong></h3><p>Penggunaan framework seperti React Native, Flutter, dan SwiftUI semakin memudahkan pengembangan aplikasi mobile yang lebih cepat dan efisien. Dengan pendekatan ini, pengembang dapat membangun aplikasi untuk berbagai platform (iOS dan Android) menggunakan satu basis kode yang sama.</p><h3>7. <strong>Internet of Things (IoT) dan Automasi</strong></h3><p>Internet of Things (IoT) memungkinkan berbagai perangkat untuk saling terhubung dan berkomunikasi melalui internet. Teknologi ini digunakan dalam rumah pintar (smart home), kendaraan otonom, dan sektor industri untuk meningkatkan efisiensi operasional.</p><h3><strong>Kesimpulan</strong></h3><p>Dunia IT Programming dan teknologi terus mengalami inovasi yang signifikan. Bagi para developer dan profesional IT, penting untuk selalu mengikuti perkembangan terbaru agar tetap relevan di industri ini. Dengan memahami tren seperti AI, Web3, cybersecurity, dan cloud computing, kita dapat lebih siap menghadapi tantangan masa depan dalam dunia teknologi.</p>`,
    //     excerpt: "Perkembangan Dunia IT Programming dan Teknologi di Era DigitalDunia IT Programming dan teknologi terus berkembang dengan pesat seiring dengan kemajuan...",
    //     slug: "perkembangan-dunia-it-programming-dan-teknologi-di-era-digital",
    //     status: "PUBLISH",
    //     tags: ["berperang", "ai", "teknologi", "warga", "harimau", "ikan hiu"],
    //     authorId: "user_2tcEgX9H7c3F3DMQj3oM018FuAA",
    //     featuredImage: "https://ik.imagekit.io/lananglp/uploads/image-photo-1555066931-4365d14bab8c_UtVBH8Si3.jpg",
    //     altText: "Penggunaan framework seperti React Native, Flutter, dan SwiftUI semakin memudahkan",
    //     commentStatus: "OPEN",
    //     meta: {
    //         title: "Perkembangan Dunia IT Programming dan Teknologi di Era Digital",
    //         ogImage: "https://ik.imagekit.io/lananglp/uploads/image-photo-1555066931-4365d14bab8c_UtVBH8Si3.jpg",
    //         keywords: ["berperang", "ai", "teknologi", "warga", "harimau", "ikan hiu"],
    //         description: "Perkembangan Dunia IT Programming dan Teknologi di Era DigitalDunia IT Programming dan teknologi terus berkembang dengan pesat seiring dengan kemajuan..."
    //     },
    //     categories: [
    //         { id: "e2cda258-1e0c-45dd-a6c4-cca93d4acca3", name: "welcome" },
    //         { id: "03947ed1-54c6-4ad1-9f05-c593baa85690", name: "Ikan Lele" },
    //         { id: "21c2ee78-9022-4c02-adc8-b9ccd8972082", name: "Nasional" },
    //         { id: "f1e830fc-f82a-4753-bc99-afd6ba7c0953", name: "for two" },
    //         { id: "4a3d7a24-2c76-475a-ad2e-953a415c079f", name: "kedua" },
    //         { id: "bf6d9dc4-079c-4f46-bfe0-ee8187f0b889", name: "ketiga" },
    //         { id: "328cda74-9a20-407b-9891-41e6ea0e554a", name: "Nusantara" }
    //     ]
    // };

    if (!post) {
        return <div>Post not found</div>;
    }

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }

    return (
        <div className='grid grid-cols-8 gap-6'>
            <div className='col-span-8 lg:col-span-5 max-w-full mx-auto prose dark:prose-invert prose-custom'>
                <header>
                    {post.featuredImage && (
                        <figure className='mt-0'>
                            <Image src={post.featuredImage} alt="Featured image AI" width={608} height={342} className='aspect-video object-cover w-full h-full' />
                            {post.altText && <figcaption className='text-zinc-600 dark:text-zinc-400 text-xs mt-2'>{post.altText}</figcaption>}
                        </figure>
                    )}
                    <h1 className='font-bold'>{post.title}</h1>
                    {/* <p><em>Written by <strong>{post.author.name ? post.author.name : 'Anonymous'}</strong> | Published on {formatDateTime(post.createdAt.toISOString())}</em></p> */}
                </header>
                <article className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(post.content) }} />
            </div>
            <div className='col-span-8 lg:col-span-3'>
                <div className='h-full flex flex-col space-y-6'>
                    <div className='space-y-6'>
                        <div className='py-4 border-b border-template flex justify-between items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className='font-medium text-black dark:text-white'>{post.author.name ? post.author.name : 'Anonymous'}</p>
                            </div>
                            <div>
                                <Button size={'sm'}><PlusIcon />Follow</Button>
                            </div>
                        </div>
                        <p className='italic'>Published on {formatDateTime(post.createdAt.toISOString())}</p>
                        <div className='space-y-6'>
                            <div>
                                <p className='font-medium text-black dark:text-white mb-2'>Categories:</p>
                                {post.categories.length && (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {post.categories.map((item, index) => (
                                            <Link key={index} href={`/${item.name.split(' ').join('-').toLowerCase()}`} className='px-4 py-1 hover:bg-zinc-200 hover:dark:bg-zinc-900 hover:text-black hover:dark:text-white border border-template rounded text-sm'>{item.name}</Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className='font-medium text-black dark:text-white mb-2'>Tags:</p>
                                {post.tags.length && (
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {post.tags.map((tag, index) => (
                                            <div key={index} className='px-4 py-1 border border-template rounded text-sm'>#{tag.split(' ').join('')}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex-grow'>
                        <PostComment />
                    </div>
                    <div>
                        <p className='font-medium text-black dark:text-white mb-4'>Related Posts :</p>
                        <div className='space-y-4'>
                            {[1,2,3,4,5,6,7,8,9,10].map((item, index) => (
                                <div className='flex items-center gap-4' key={index}>
                                    <div className='aspect-video w-80 rounded-lg border border-template' />
                                    <div className='w-full space-y-2'>
                                        <p className='line-clamp-2 font-medium text-black dark:text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, quos.</p>
                                        <p className='line-clamp-2 text-xs'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo eaque natus aperiam animi explicabo perspiciatis veniam hic optio nulla fugit inventore autem soluta dignissimos facilis, eligendi aliquam dicta esse porro?</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const commentCreateSchema = z.object({
    comment: z.string().min(1, "Comment is required"),
});

type CommentCreateFormType = z.infer<typeof commentCreateSchema>;

const PostComment = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<CommentCreateFormType>({
        resolver: zodResolver(commentCreateSchema),
        defaultValues: { comment: "" },
    });
    const [textareaHeight, setTextareaHeight] = useState<number>(0);

    const handleClickSubmit = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<CommentCreateFormType> = async (data) => console.log(data);

    return (
        <div className="sticky top-24 border border-template rounded-xl">
            <div className={`px-4 hover:bg-template py-4 rounded-t-xl cursor-pointer flex items-center justify-between hover-bg-template transition-colors duration-300`}>
                <h4 className={`font-medium text-base text-black dark:text-white`}><span>Discussion and Comments&nbsp;</span></h4>
                <p><MessageCircle className='inline h-4 w-4 mb-0.5 me-2' />2.3k</p>
            </div>
            <div>
                <Separator />
                {/* <div style={{ height: `calc(65vh - ${textareaHeight}px)` }} className="overflow-y-auto space-y-4 p-4"> */}
                <div style={{ height: `calc(100svh - ${textareaHeight}px - 11rem)` }} className="overflow-y-auto space-y-4 p-4">
                    {["Putri", "Lukman", "Leonardo"].map((name, index) => (
                        <div key={index} className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <strong className="text-black dark:text-white font-semibold">{name}</strong>
                                    {name === "Putri" ? " Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis."
                                        : name === "Lukman" ? " Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?"
                                            : " AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri."}
                                </p>
                            </div>
                        </div>
                    ))}
                    {["Putri", "Lukman", "Leonardo"].map((name, index) => (
                        <div key={index} className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <strong className="text-black dark:text-white font-semibold">{name}</strong>
                                    {name === "Putri" ? " Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis."
                                        : name === "Lukman" ? " Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?"
                                            : " AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri."}
                                </p>
                            </div>
                        </div>
                    ))}
                    {["Putri", "Lukman", "Leonardo"].map((name, index) => (
                        <div key={index} className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <strong className="text-black dark:text-white font-semibold">{name}</strong>
                                    {name === "Putri" ? " Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis."
                                        : name === "Lukman" ? " Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?"
                                            : " AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri."}
                                </p>
                            </div>
                        </div>
                    ))}
                    {["Putri", "Lukman", "Leonardo"].map((name, index) => (
                        <div key={index} className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <strong className="text-black dark:text-white font-semibold">{name}</strong>
                                    {name === "Putri" ? " Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis."
                                        : name === "Lukman" ? " Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?"
                                            : " AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri."}
                                </p>
                            </div>
                        </div>
                    ))}
                    {["Putri", "Lukman", "Leonardo"].map((name, index) => (
                        <div key={index} className="flex items-start gap-3 border-b dark:border-zinc-900 pb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <strong className="text-black dark:text-white font-semibold">{name}</strong>
                                    {name === "Putri" ? " Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis."
                                        : name === "Lukman" ? " Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?"
                                            : " AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <form className="p-0 border-t border-template">
                    <Controller
                        name="comment"
                        control={control}
                        render={({ field }) => (
                            <InputComment
                                control={control}
                                name="comment"
                                value={field.value}
                                onSubmit={handleClickSubmit}
                                onHeightChange={(value) => setTextareaHeight(value)}
                            />
                        )}
                    />
                </form>
            </div>
        </div>
    );
};


export default PostShow