import { formatDateTime } from '@/helper/helper';
import { PostType } from '@/types/post-type';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import '@/app/text-editor-preview.scss';

type Props = {
    post: PostType;
};

function PostShow({ post }: Props) {

    if (!post) {
        return <div>Post not found</div>;
    }

    const parseHTML = (content: string) => {
        const html = content.replace(/<p>\s*<\/p>/g, "<br/>")

        return html;
    }

    return (
        <div className='max-w-3xl mx-auto prose dark:prose-invert prose-th:border prose-td:border prose-th:dark:bg-zinc-900/50 prose-zinc prose-th:px-2 prose-li:mb-0 prose-headings:text-zinc-700 prose-headings:dark:text-white prose-strong:text-zinc-700 prose-strong:dark:text-white prose-a:text-zinc-700 prose-a:dark:text-white'>
            <header>
                {post.featuredImage && (
                    <figure>
                        <Image src={post.featuredImage} alt="Featured image AI" width={608} height={342} className='aspect-video object-cover w-full h-full' />
                        <figcaption>Gambar utama: Ilustrasi kecerdasan buatan.</figcaption>
                    </figure>
                )}
                <h1 className='font-bold'>{post.title}</h1>
                <p><em>Ditulis oleh <strong>{post.author.name}</strong> | Dipublikasikan pada {formatDateTime(post.createdAt.toISOString())}</em></p>
            </header>
            <article className='tiptap-preview' dangerouslySetInnerHTML={{ __html: parseHTML(post.content) }} />
            <aside>
                <h3>Kategori:</h3>
                {post.categories.length && (
                    <div className='flex flex-wrap items-center gap-1'>
                        {post.categories.map((item, index) => (
                            <Link key={index} href={`/${item.category.name.toLowerCase()}`} className='px-4 py-1 bg-zinc-900 rounded no-underline hover:underline'>{item.category.name}</Link>
                        ))}
                    </div>
                )}
                <h3>Tag:</h3>
                {post.tags.length && (
                    <div className='flex flex-wrap items-center gap-1'>
                        {post.tags.map((tag, index) => (
                            <div key={index} className='px-4 py-1 bg-zinc-900 rounded text-sm'>#{tag.split(' ').join('')}</div>
                        ))}
                    </div>
                )}
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

export default PostShow