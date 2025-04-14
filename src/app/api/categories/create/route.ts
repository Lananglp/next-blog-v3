import { NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import type { Category } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { categories } = await req.json();

        if (!Array.isArray(categories) || categories.length === 0) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Categories array is required",
            }, { status: 400 });
        }

        const validNamePattern = /^[a-zA-Z0-9 _-]+$/;

        const validNames: string[] = [];
        const invalidNames: string[] = [];

        for (const cat of categories) {
            const name = typeof cat.name === "string" ? cat.name.trim() : "";
            if (name && validNamePattern.test(name)) {
                validNames.push(name.toLowerCase());
            } else {
                invalidNames.push(name);
            }
        }

        if (validNames.length === 0) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "All category names are invalid or contain unsupported characters.",
                invalidNames,
            }, { status: 400 });
        }

        const existing = await prisma.category.findMany({
            where: {
                name: {
                    in: validNames,
                    mode: "insensitive",
                },
            },
            select: { name: true },
        });

        const existingNames = new Set(existing.map(e => e.name.toLowerCase()));

        const toCreate = validNames
            .filter(name => !existingNames.has(name))
            .map(name => ({ name }));

        let created: Category[] = [];

        if (toCreate.length > 0) {
            await prisma.category.createMany({
                data: toCreate,
                skipDuplicates: true,
            });

            created = await prisma.category.findMany({
                where: {
                    name: {
                        in: toCreate.map(c => c.name),
                        mode: "insensitive",
                    },
                },
            });
        }

        // Buat pesan akhir
        const messageParts: string[] = [];

        if (created.length > 0) {
            messageParts.push(`✅ Created ${created.length} categories.`);
        }
        if (existingNames.size > 0) {
            messageParts.push(`⚠️ ${existingNames.size} already exist: ${Array.from(existingNames).join(", ")}`);
        }
        if (invalidNames.length > 0) {
            messageParts.push(`❌ ${invalidNames.length} contain invalid characters: ${invalidNames.join(", ")}`);
        }

        return NextResponse.json({
            status: created.length > 0 ? responseStatus.success : responseStatus.warning,
            message: messageParts.join(" "),
            categories: created,
            invalidNames,
        }, {
            status: created.length > 0 ? 201 : 400,
        });

    } catch (error) {
        console.error("Failed to create categories:", error);
        return NextResponse.json({
            status: responseStatus.error,
            message: error instanceof Error ? error.message : "Something went wrong",
        }, { status: 500 });
    }
}
