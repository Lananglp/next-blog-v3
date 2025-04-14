import { NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const { id, name } = await req.json();

        // Validasi dasar
        if (!id || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Valid category ID and new name are required",
            }, { status: 400 });
        }

        const newName = name.trim();

        // Validasi karakter khusus: hanya huruf, angka, spasi, dash, dan underscore
        const validNamePattern = /^[a-zA-Z0-9 _-]+$/;
        if (!validNamePattern.test(newName)) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category name cannot contain special characters",
            }, { status: 400 });
        }

        const normalizedNewName = newName.toLowerCase();

        // Cek apakah kategori dengan ID tersebut ada
        const existingCategory = await prisma.category.findUnique({ where: { id } });

        if (!existingCategory) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category not found",
            }, { status: 404 });
        }

        // Cek duplikat nama (case-insensitive & bukan dirinya sendiri)
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: normalizedNewName,
                    mode: "insensitive",
                },
                NOT: { id },
            },
        });

        if (duplicateCategory) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Category name already exists",
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
            category: updatedCategory,
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to update category:", error);
        return NextResponse.json({
            status: responseStatus.error,
            message: error instanceof Error ? error.message : "Internal server error",
        }, { status: 500 });
    }
}
