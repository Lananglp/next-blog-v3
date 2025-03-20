import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { responseStatus } from "@/helper/system-config";
import { imagekit } from "@/lib/imagekit";

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ status: responseStatus.warning, message: "Invalid request data" }, { status: 400 });
        }

        // Ambil data user sebelum dihapus untuk mendapatkan imageId dan imageProvider
        const users = await prisma.user.findMany({
            where: { id: { in: ids } },
            select: { id: true, imageId: true, imageProvider: true },
        });

        // Ambil hanya user yang menggunakan ImageKit (imageProvider === "DEFAULT")
        const imagekitFileIds = users
            .filter((user) => user.imageProvider === "DEFAULT" && user.imageId)
            .map((user) => user.imageId as string);

        // Hapus gambar-gambar di ImageKit jika ada
        if (imagekitFileIds.length > 0) {
            try {
                await imagekit.bulkDeleteFiles(imagekitFileIds);
            } catch (err) {
                console.error("Error deleting images in ImageKit:", err);
            }
        }

        // Hapus user dari database
        await prisma.user.deleteMany({
            where: { id: { in: ids } },
        });

        return NextResponse.json({ status: responseStatus.success, message: "Users deleted successfully" });
    } catch (error) {
        console.error("Error deleting users:", error);
        return NextResponse.json({ status: responseStatus.error, message: "Something went wrong" }, { status: 400 });
    }
}
