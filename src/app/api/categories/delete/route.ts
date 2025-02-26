import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { responseStatus } from '@/helper/system-config';

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ status: responseStatus.warning, message: 'Invalid request data' }, { status: 400 });
        }

        await prisma.category.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ status: responseStatus.success, message: 'Categories deleted successfully' });
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: error || 'Something went wrong' }, { status: 400 });
    }
}
