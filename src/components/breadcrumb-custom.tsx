"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbCustomProps {
    basePath?: string; // Custom base path
    className?: string; // Custom class name
}

export default function BreadcrumbCustom({ basePath = "/", className }: BreadcrumbCustomProps) {
    const pathname = usePathname(); // Dapatkan path saat ini
    const pathSegments = pathname.startsWith(basePath)
        ? pathname.replace(basePath, "").split("/").filter(Boolean)
        : [];

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {/* Tambahkan basePath sebagai breadcrumb pertama */}
                {basePath !== "/" ? (
                    <BreadcrumbItem className="hidden lg:block">
                        <BreadcrumbLink asChild>
                            <Link href={basePath}>{decodeURIComponent(basePath.replace("/", ""))}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem className="hidden lg:block">
                        <BreadcrumbLink asChild>
                            <Link href="/">home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {pathSegments.map((segment, index) => {
                    const href = basePath + "/" + pathSegments.slice(0, index + 1).join("/"); // Buat URL untuk setiap segment
                    const isLast = index === pathSegments.length - 1; // Cek apakah ini segment terakhir

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator className="hidden lg:block" />
                            <BreadcrumbItem className="hidden lg:block">
                                {isLast ? (
                                    <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{decodeURIComponent(segment)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
