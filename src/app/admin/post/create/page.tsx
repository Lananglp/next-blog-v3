'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import TextEditorSelasa from '@/components/text-editor';

// Dynamic import untuk mencegah SSR error
// const TextEditor = dynamic(() => import('@/components/text-editor-old'), {
//   ssr: false,
// });

function PostCreate() {

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            content: `
            <h2><strong>Seorang pria rela melakukan apa saja namun begini nyatanya...</strong></h2><p></p><hr><p></p><p>Di suatu tempat terjadilah <mark>kehidupan </mark>yang sangat dahyat yang mampu merusak alam serta memperburuk sebuah cuaca, namun dibalik semua ini terdapat seorang pria yang memiliki kekuatan dalam hal gaib, dia mampu untuk melanjutkan semua unit setiap gedung yang ada di atas rata-rata kehidupan nasional.</p><p></p><p><code>npm install lanang-lanusa-blog</code></p><p></p><p>menurut warga setempat kejadian ini sering terjadi karena pria tersebut selain memiliki kemampuan seperti itu, pria ini mampu mengendalikan ke 4 element jutsu yang dimiliki <mark> avatar </mark> si ang, sangat luar biasa.</p><p></p><p>kehebatan orang ini sangatlah luar biasa, dia bisa melakukan jutsu : <code>npm i react-icons </code>, berbekal ini saja dia mampu mengarungi lautan manusia.</p><p></p><p>berikut merupakan kemampuan yang dimilikinya:</p><p></p><ul><li><p>Mampu bekerja dibawah <strong>tekanan</strong></p></li><li><p>Selalu menjunjung tinggi <em>persahabatan</em></p></li><li><p>Selalu menjaga etika dan <u>kesopanan</u></p></li><li><p>serta ahli dalam bidang <s>komputer</s></p></li><li><p>ahli dalam : x<sup>2</sup> + y<sup>2</sup> = xy<sup>2</sup></p></li></ul><p></p><p>Untuk menjadi seorang pria tersebut kamu perlu menginstal beberapa paket library seperti berikut:</p><p></p><pre><code>npm install axios</code></pre><p>setelah mengetik ini di terminal kamu, lanjut ke bagian ini:</p><pre><code>const Home = () =&gt; { return ( &lt;div&gt;Hello World!&lt;/div&gt; ) }</code></pre><p>dibalik itu semua pria ini memiliki sebuah senjata pamungkan yang dapat melenyabkan beberapa warga sekitar :</p><p></p><blockquote><p>Jika hidup hanya untuk mati, maka untuk apa aku berjuang mempertahankan kehidupan yang aku anggap indah - Lanang Lanusa</p></blockquote><p></p><p></p>
            `,
        },
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    const showContent = watch('content');
    const woiTitle = watch('title');

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4">Buat Postingan</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p>Title :</p>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => {
                        return (
                            <textarea {...field}></textarea>
                        )
                    }}
                />
                <p>{watch('title')}</p>

                {/* Gunakan Editor */}
                <p>Content :</p>
                <TextEditorSelasa control={control} name="content" />
                <p>{woiTitle}</p>

                {/* Preview Konten */}
                <div className="border p-2 mt-2">
                    <h2 className="text-lg font-semibold">Preview:</h2>
                    <div dangerouslySetInnerHTML={{ __html: watch("content") }} />
                </div>

                {/* Tombol Submit */}
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>
            <div className='mt-12'>
                <p>Contoh:</p>
                {showContent}
            </div>
        </div>
    );
}

export default PostCreate