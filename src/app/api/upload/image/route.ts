import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma'; // Pastikan prisma client sudah dibuat

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Simpan file di public/uploads
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), 'public/uploads/image', file.name);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/image/${file.name}`;

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
