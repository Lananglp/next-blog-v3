import { AppSidebar } from "@/components/app-sidebar"
import BatteryStatus from "@/components/battery-status"
import BreadcrumbCustom from "@/components/breadcrumb-custom"
import { ModeToggle } from "@/components/dark-mode-button"
import PageTitle from "@/components/page-title"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const appName = process.env.NEXT_PUBLIC_APP_NAME

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-30 bg-white dark:bg-zinc-950 border-b border-template flex justify-between pe-1.5 h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadcrumbCustom basePath="/admin" />
                        <div className="lg:hidden line-clamp-1 text-black dark:text-white text-base md:text-lg lg:text-xl font-semibold">{appName} App</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BatteryStatus />
                        <ModeToggle />
                    </div>
                </header>
                <div className="p-4 pt-4">
                    <PageTitle />
                    <div className='grid grid-cols-1'>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}