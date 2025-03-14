import { NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { categories } = await req.json();

        if (!Array.isArray(categories) || categories.length === 0) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Categories array is required"
            }, { status: 400 });
        }

        const results = {
            success: [] as any[],
            duplicates: [] as string[],
        };

        // Process each category
        for (const item of categories) {
            const { name } = item;
            if (!name || typeof name !== "string") continue;

            // Normalize category name to lowercase
            const normalizedCategoryName = name.toLowerCase();

            // Check if category exists (case-insensitive)
            const existingCategory = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: normalizedCategoryName,
                        mode: "insensitive",
                    },
                },
            });

            if (existingCategory) {
                results.duplicates.push(name);
                continue;
            }

            // Create new category
            const newCategory = await prisma.category.create({
                data: { name },
            });
            results.success.push(newCategory);
        }

        // Prepare response message
        let message = "";
        if (results.success.length > 0) {
            message += `Successfully created ${results.success.length} categories. `;
        }
        if (results.duplicates.length > 0) {
            message += `${results.duplicates.length} categories already exist: ${results.duplicates.join(", ")}`;
        }

        return NextResponse.json({
            status: results.success.length > 0 ? responseStatus.success : responseStatus.warning,
            message: message || "No valid categories provided",
            categories: results.success
        }, {
            status: results.success.length > 0 ? 201 : 400
        });

    } catch (error) {
        console.error("Failed to create categories:", error);
        return NextResponse.json({
            status: responseStatus.error,
            message: error
        }, { status: 500 });
    }
}
