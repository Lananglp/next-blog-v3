"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbCustomProps {
    basePath?: string; // Custom base path
    className?: string; // Custom class name
}

export default function BreadcrumbCustom({
    basePath = "/",
    className,
}: BreadcrumbCustomProps) {
    const pathname = usePathname(); // Dapatkan path saat ini

    // Perbaikan untuk menghindari pemotongan yang salah ketika basePath adalah "/"
    const adjustedPath = pathname.startsWith(basePath + "/")
        ? pathname.replace(basePath, "")
        : pathname === basePath ? "" : pathname;

    const pathSegments = adjustedPath.split("/").filter(Boolean);

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {/* Base path breadcrumb */}
                <BreadcrumbItem className="hidden lg:block">
                    <BreadcrumbLink asChild>
                        <Link href={basePath}>{basePath === "/" ? "home" : decodeURIComponent(basePath.replace("/", ""))}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {pathSegments.map((segment, index) => {
                    const href =
                        basePath === "/"
                            ? `/${pathSegments.slice(0, index + 1).join("/")}`
                            : `${basePath}/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;

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
