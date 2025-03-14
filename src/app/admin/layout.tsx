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
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex justify-between pe-1.5 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadcrumbCustom basePath="/admin" />
                    </div>
                    <div className="flex items-center gap-2">
                        <BatteryStatus />
                        <ModeToggle />
                    </div>
                </header>
                <div className="p-4 pt-0">
                    <PageTitle />
                    <div className='grid grid-cols-1'>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}