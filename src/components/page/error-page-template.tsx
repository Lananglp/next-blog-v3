import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface ErrorPageTemplateProps {
    templateFor: "default" | "admin";
    statusCode?: number;
    title?: string;
    description?: string;
    redirect?: string;
    redirectText?: string;
    disableRedirect?: boolean;
    children?: React.ReactNode;
};

export default function ErrorPageTemplate({
    templateFor,
    statusCode=404,
    title="Something&#39;s missing.",
    description="Sorry, we can&#39;t find that page. You&#39;ll find lots to explore on the home page.",
    redirect="/admin",
    redirectText="Back to Homepage",
    disableRedirect=false,
    children,
}: ErrorPageTemplateProps) {
    if (templateFor === "default") {
        return (
            <section className="h-screen flex flex-col md:flex-row md:items-center">
                <div className="py-8 px-4 mx-auto w-full max-w-3xl lg:py-16 lg:px-6">
                    <div className="w-full text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">{statusCode}</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-zinc-900 md:text-4xl dark:text-white">{title}</p>
                        <p className="mb-4 text-lg font-light">{description}</p>
                        {children && <div className="mb-4">{children}</div>}
                        {!disableRedirect && <Link href={redirect} className="hover:bg-zinc-200 hover:dark:bg-zinc-900/50 hover:text-black hover:dark:text-white rounded-lg transition-colors duration-150 py-2 px-3"><MoveLeft className="inline h-4 w-4 mb-0.5 me-1.5" />{redirectText}</Link>}
                    </div>
                </div>
            </section>
        )
    } else if (templateFor === "admin") {
        return (
            <section>
                <div className="border border-template rounded-lg p-6">
                    <div className="space-y-4 text-sm">
                        <p className="mb-4 tracking-tight font-bold text-zinc-900 md:text-3xl dark:text-white">
                            <span>{statusCode}</span>
                            <span className="px-4">
                                <span className="border-e border-template"/>
                            </span>
                            <span>{title}</span>
                        </p>
                        <p className="mb-4">{description}</p>
                        {children && (
                            <div className="mb-4 overflow-x-auto">
                                {children}
                            </div>
                        )}
                        {!disableRedirect && <Link href={redirect} className="inline-block w-full md:w-auto text-center bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 hover:dark:bg-zinc-800 hover:text-black hover:dark:text-white rounded-lg transition-colors duration-150 py-2 px-4"><MoveLeft className="inline h-4 w-4 mb-0.5 me-1.5" />{redirectText}</Link>}
                    </div>
                </div>
            </section>
        )
    }
}