import { NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name || typeof name !== "string") {
            return NextResponse.json({ status: responseStatus.warning, message: "Category name is required" }, { status: 400 });
        }

        // Normalisasi nama kategori menjadi huruf kecil
        const normalizedCategoryName = name.toLowerCase();

        // Cek apakah kategori sudah ada (case-insensitive)
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: normalizedCategoryName,
                    mode: "insensitive", // Pastikan pencarian tidak case-sensitive
                },
            },
        });

        if (existingCategory) {
            return NextResponse.json({ status: responseStatus.warning, message: "Categories already exist" }, { status: 409 });
        }

        // Buat kategori baru dengan nama yang tetap sesuai input
        const newCategory = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json({ status: responseStatus.success, message: "Category created successfully", category: newCategory }, { status: 201 });

    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ status: responseStatus.error, message: error }, { status: 500 });
    }
}
