"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  useSidebar,
} from "@/components/ui/sidebar"

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
    <div className="flex items-center gap-2 px-1 pt-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <app.logo className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {app.name}
        </span>
        <span className="truncate text-xs">{app.description}</span>
      </div>
    </div>
  )
}
