"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppInformation({
  appName,
}: {
  appName: {
    name: string
    logo: React.ElementType
    description: string
  }
}) {
  const { isMobile } = useSidebar()
  const [app, setApp] = React.useState(appName)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/admin">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <app.logo className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none text-nowrap">
              <span className="font-semibold">{app.name}</span>
              <span className="">{app.description}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
