import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { responseStatus } from '@/helper/system-config';

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json(); // Ambil array ID dari body request

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ status: responseStatus.warning, message: 'Invalid request data' }, { status: 400 });
        }

        // Hapus semua post berdasarkan ID
        await prisma.post.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ status: responseStatus.success, message: 'Posts deleted successfully' });
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: error || 'Something went wrong' }, { status: 400 });
    }
}
