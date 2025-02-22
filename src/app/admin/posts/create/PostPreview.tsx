'use client'
import React from 'react'
import '@/app/text-editor-preview.scss';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import Image from 'next/image';
import { PostFormValues } from '@/helper/schema/schema';

type Props = {
    value: PostFormValues;
}

function PostPreview({ value } : Props) {

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }    

    return (
        <div className='py-12 max-w-3xl mx-auto prose dark:prose-invert prose-th:border prose-td:border prose-th:dark:bg-zinc-900/50 prose-zinc prose-th:px-2 prose-li:mb-0 prose-headings:text-zinc-700 prose-headings:dark:text-white prose-strong:text-zinc-700 prose-strong:dark:text-white prose-a:text-zinc-700 prose-a:dark:text-white'>
            <Alert className='sticky top-4 z-10 bg-zinc-100 dark:bg-zinc-950'>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Preview Mode</AlertTitle>
                <AlertDescription>
                    This is just a post preview, your post will not be visible to users before you publish it.
                </AlertDescription>
            </Alert>
            <header>
                <figure>
                    {value.featuredImage ? (
                        <Image unoptimized src={value.featuredImage} alt="Featured image AI" width={768} height={432} className='aspect-video object-cover' />
                    ) : (
                        <div className='aspect-video bg-zinc-200 dark:bg-zinc-900/50 text-zinc-500 rounded-lg flex justify-center items-center'>
                            <div className='text-center'>
                                <div>Your post thumbnail will appear here.</div>
                                <div className='text-xs'>Recommended: 16:9 (Landscape)</div>
                            </div>
                        </div>
                    )}
                    <figcaption>Gambar utama: Ilustrasi kecerdasan buatan.</figcaption>
                </figure>
                <h1 className='font-bold'>{value.title}</h1>
                <p><em>Ditulis oleh <strong>Admin TechNews</strong> | Dipublikasikan pada <time dateTime="2025-02-17">17 Februari 2025</time></em></p>
            </header>
            <article className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(value.content) }} />
            <aside>
                <h3>Kategori:</h3>
                <p><a href="#" className='no-underline hover:underline'>Teknologi</a>, <a href="#" className='no-underline hover:underline'>AI</a></p>
                <h3>Tag:</h3>
                <p><a href="#" className='no-underline hover:underline'>#AI</a>, <a href="#" className='no-underline hover:underline'>#MachineLearning</a>, <a href="#" className='no-underline hover:underline'>#Teknologi</a></p>
            </aside>

            <section id="komentar">
                <h2>Diskusi dan Komentar</h2>
                <div className="komentar">
                    <p><strong>Rizky</strong>: Artikel yang sangat menarik! Saya ingin tahu lebih lanjut tentang implementasi AI dalam dunia medis.</p>
                </div>
                <div className="komentar">
                    <p><strong>Putri</strong>: Saya sangat tertarik dengan NLP, apakah ada rekomendasi buku atau kursus untuk mempelajarinya?</p>
                </div>
                <div className="komentar">
                    <p><strong>Andi</strong>: AI memang luar biasa! Saya ingin mencoba membangun model Machine Learning sendiri.</p>
                </div>
                <form>
                    <label htmlFor="komentar-input">Tulis komentar Anda:</label><br />
                    <textarea id="komentar-input" rows={4} cols={50} defaultValue={""} /><br />
                    <button type="submit">Kirim</button>
                </form>
            </section>

            <footer>
                <p>© 2025 TechNews. Semua Hak Dilindungi.</p>
            </footer>
        </div>
    )
}

export default PostPreview