import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma'; // Pastikan prisma client sudah dibuat

export async function DELETE(req: Request) {
    try {
        const { imageId } = await req.json();

        if (!imageId) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        // Cari gambar di database
        const image = await prisma.image.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Path file di server
        const filePath = path.join(process.cwd(), 'public', image.url);

        try {
            // Hapus file dari server
            await unlink(filePath);
        } catch (fileError) {
            console.warn('File not found on disk, skipping:', filePath);
        }

        // Hapus data dari database
        await prisma.image.delete({
            where: { id: imageId },
        });

        return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
