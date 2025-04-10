import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idParam = searchParams.get('id');
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');
        const search = searchParams.get('search') || '';

        if (idParam) {
            const checkData = await prisma.user.findUnique({
                where: { id: idParam },
            });

            if (!checkData) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            return NextResponse.json(checkData);
        }

        // Pagination & Filtering semua data
        const page = pageParam ? parseInt(pageParam, 10) : undefined;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;

        const whereClause: Prisma.UserWhereInput = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        const totalData = await prisma.user.count({ where: whereClause });

        const data = await prisma.user.findMany({
            where: whereClause,
            skip: page && limit ? (page - 1) * limit : undefined,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { posts: true },
        });

        return NextResponse.json({
            items: data,
            pagination: page && limit ? {
                total: totalData,
                page,
                limit,
                totalPages: Math.ceil(totalData / limit),
            } : null,
        });
    } catch (error) {
        return NextResponse.json({ message: error || 'Terjadi kesalahan' }, { status: 500 });
    }
}
