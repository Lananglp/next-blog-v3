import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
    try {
        (await cookies()).delete("token");

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}