import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    try {
        const filename = (await params).filename;

        const filePath = path.join(process.cwd(), "public/uploads/image", filename);

        if (filePath) {
            const file = await readFile(filePath);

            return new NextResponse(file, {
                headers: {
                    "Content-Type": "image/png",
                    "Cache-Control": "no-store",
                },
            });
        }

        return NextResponse.json({ error: "File not found" }, { status: 404 });
    } catch (error) {
        // console.error("Error:", error);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
