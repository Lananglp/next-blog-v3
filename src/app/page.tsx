'use client'
import Template from "@/components/template-custom";
import { Gauge, PencilRuler, PenLine, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Home() {
    return (
        <Template>
            <section className="space-y-6">
                <div className="fixed inset-0 bg-gradient-to-br from-sky-500/5 from-[0%] via-transparent via-[55%] to-sky-500/5 to-[0%] pointer-events-none">
                    <div className="fixed inset-x-0 top-0 h-1/2 bg-gradient-to-tr from-transparent from-[0%] via-transparent via-[65%] to-sky-500/5 to-[0%] pointer-events-none"/>
                </div>
                <div className="w-full flex flex-row gap-6">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 font-semibold text-black dark:text-white text-xl">Stay Informed & Build Your Own Blog</h1>
                        {/* <p className="mb-6 text-5xl leading-tight font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-black to-[50%] dark:to-white">Ekspresikan Dirimu Lewat Blog: Bebaskan Kreativitasmu!</p> */}
                        <p className="mb-8 text-5xl leading-tight font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-black to-[50%] dark:to-white">Express Yourself Through Blogging: Unleash Your Creativity!</p>
                        {/* <p className="leading-7">Di dunia yang penuh dengan informasi, suara asli dan kreatif sangatlah berharga. Blog memberimu kesempatan untuk menjadi diri sendiri, mengeksplorasi minatmu, dan terhubung dengan pembaca yang tertarik dengan apa yang kamu tawarkan. Mulailah petualangan bloggingmu hari ini dan biarkan kreativitasmu bersinar!</p> */}
                        <p className="leading-7">In a world filled with information, authentic and creative voices are invaluable. A blog gives you the opportunity to be yourself, explore your interests, and connect with readers who are interested in what you have to offer. Start your blogging adventure today and let your creativity shine!</p>
                    </div>
                    <div className="hidden w-full xl:flex justify-center items-center">
                        <Image src="/images/writer.png" width={312} height={312} alt="hero" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <TrendingUp className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Stay Updated</h6>
                                <p className="text-sm">Read the latest news from Indonesia and beyond.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <PenLine className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Build Your Own Blog</h6>
                                <p className="text-sm">Get a professionally designed, SEO-optimized website.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <PencilRuler className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Powerful Content Editor</h6>
                                <p className="text-sm">Easily manage your blog with a high-quality editor.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-full ps-[1px] pt-[1px] bg-gradient-to-br from-sky-500 from-[0%] to-transparent to-[50%] rounded-lg">
                            <div className="h-full p-6 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 from-[0%] to-white/25 dark:to-black/75 to-[100%] rounded-lg shadow-lg">
                                <Gauge className="mb-2" />
                                <h6 className="mb-2 font-medium text-black dark:text-white">Boost SEO Performance</h6>
                                <p className="text-sm">Get a blog that ranks well on search engines.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Template>
    );
}