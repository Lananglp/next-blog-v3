import { NextRequest, NextResponse } from "next/server";
import { responseStatus } from "@/helper/system-config";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');

        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", req.url));
        } else if (req.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL("/", req.url));
        } else {
            return NextResponse.json({ status: responseStatus.success, message: "User authorized" }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: error });
    }
}
