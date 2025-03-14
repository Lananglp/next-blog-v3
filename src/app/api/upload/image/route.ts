import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import prisma from "@/lib/prisma"; // Pastikan prisma client sudah dibuat
import { imagekit } from "@/lib/imagekit";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validasi ekstensi gambar
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const originalName = file.name.toLowerCase();
        const extension = originalName.split(".").pop() || "";

        if (!allowedExtensions.includes(extension)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // Konversi file ke Base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Buat nama file unik
        const timestamp = Date.now();
        const sanitizedFileName = originalName.replace(/\s+/g, "-").replace(/[^a-z0-9.-]/g, "");
        // const finalFileName = `image-${timestamp}-${sanitizedFileName}`;
        const finalFileName = `image-${sanitizedFileName}`;

        // Upload ke ImageKit
        const uploadResponse = await imagekit.upload({
            file: base64File,
            fileName: finalFileName,
            folder: "/uploads",
        });

        // Simpan URL gambar ke database
        const image = await prisma.image.create({
            data: { url: uploadResponse.url },
        });

        return NextResponse.json({ success: true, image });
    } catch (error: any) {
        console.error("Image upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
