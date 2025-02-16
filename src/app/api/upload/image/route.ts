import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma'; // Pastikan prisma client sudah dibuat

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validasi file gambar berdasarkan ekstensi
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const originalName = file.name.toLowerCase();
        const extension = originalName.split('.').pop() || '';

        if (!allowedExtensions.includes(extension)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Buat nama file baru: lowercase, spasi jadi "-", tambahkan timestamp
        const sanitizedFileName = originalName
            .replace(/\s+/g, '-') // Ganti spasi dengan "-"
            .replace(/[^a-z0-9.-]/g, '') // Hapus karakter aneh kecuali "-"
            .replace(/\.+/g, '.') // Hindari banyak titik
            .replace(/^-+|-+$/g, '') // Hapus tanda "-" di awal/akhir
            .replace(/\.{2,}/g, '.') // Hindari dua titik atau lebih
            .replace(new RegExp(`.${extension}$`), ''); // Hapus ekstensi

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
        const day = String(now.getDate()).padStart(2, '0'); // 01-31
        const time = String(now.getTime()); // Timestamp unik
        
        const finalFileName = `image-${year}-${month}-${day}-${time}.${extension}`;
        // const finalFileName = `${sanitizedFileName}-${now}.${extension}`;

        // Path penyimpanan
        const uploadDir = path.join(process.cwd(), 'public/uploads/image');
        const filePath = path.join(uploadDir, finalFileName);

        // Buat folder jika belum ada
        await mkdir(uploadDir, { recursive: true });

        // Simpan file ke server
        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const imageUrl = `/uploads/image/${finalFileName}`;

        // Simpan URL ke database
        const image = await prisma.image.create({
            data: { url: imageUrl },
        });

        return NextResponse.json({ success: true, image });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
