import { NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const { id, name } = await req.json();
        const newName = name?.trim();

        // Validasi input
        if (!id || !newName) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category ID and new name are required"
            }, { status: 400 });
        }

        // Cek apakah kategori dengan ID tersebut ada
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category not found"
            }, { status: 404 });
        }

        // Cek apakah nama baru sudah digunakan oleh kategori lain (case-insensitive)
        const normalizedNewName = newName.toLowerCase();

        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: normalizedNewName,
                    mode: "insensitive",
                },
                NOT: { id }, // Pastikan bukan kategori yang sedang diupdate
            },
        });

        if (duplicateCategory) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category name already exists"
            }, { status: 409 });
        }

        // Update kategori
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name: newName },
        });

        return NextResponse.json({
            status: responseStatus.success,
            message: "Category updated successfully",
            category: updatedCategory
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to update category:", error);
        return NextResponse.json({
            status: responseStatus.error,
            message: "Internal server error"
        }, { status: 500 });
    }
}
