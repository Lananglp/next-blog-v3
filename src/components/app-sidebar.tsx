"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CircleGaugeIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  HashIcon,
  Map,
  PencilRulerIcon,
  PieChart,
  Settings2,
  SquareTerminal,
  UserRoundPenIcon,
  UsersRoundIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { AppInformation } from "@/components/app-information"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux"

// This is sample data.
const data = {
  appName: {
    name: process.env.NEXT_PUBLIC_APP_NAME as string,
    logo: GalleryVerticalEnd,
    description: "Version 0.1.0",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: CircleGaugeIcon,
    },
    {
      title: "Posts",
      url: "/admin/posts",
      icon: PencilRulerIcon,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: HashIcon,
    },
    {
      title: "Users Accounts",
      url: "/admin/users",
      icon: UsersRoundIcon,
    },
    {
      title: "Your Profile",
      url: "/admin/profile",
      icon: UserRoundPenIcon,
    },
    {
      title: "Content",
      url: "#",
      icon: SquareTerminal,
      // isActive: true,
      items: [
        {
          title: "Posts",
          url: "/admin/posts",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { isLogin, user } = useSelector((state: RootState) => state.session);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppInformation appName={data.appName} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isLogin={isLogin} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
