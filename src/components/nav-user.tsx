"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { UserType } from "@/types/userType"
import { logout } from "@/app/api/function/auth"
import { useDispatch } from "react-redux"
import { handleLogout } from "@/context/sessionSlice"
import { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { useRouter } from "next/navigation"

export function NavUser({
    isLogin,
    user,
}: {
    isLogin: boolean,
    user: UserType,
}) {
    const { isMobile } = useSidebar();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await logout();
            if (res.data) {
                dispatch(handleLogout());
                navigate.push("/");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Oops...",
                    description:
                        `${error.response?.data?.message}. (${error.response?.status.toString()})` ||
                        "Terjadi kesalahan",
                });
            } else {
                console.log("Unknown error:", error);
            }
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.image ? user.image.toString() : ""} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                {isLogin ? (
                                    <>
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        <Skeleton className="w-32 h-5" />
                                        <Skeleton className="w-36 h-3.5" />
                                    </div>
                                )}
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.image ? user.image.toString() : ""} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <AlertDialog>
                                <AlertDialogTrigger className="w-full text-start text-sm font-medium hover:dark:bg-zinc-800 rounded px-2 py-1.5">
                                    <LogOut className="inline h-4 w-4 ms-0.5 mb-0.5 me-1.5" />Log out
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader className="py-12">
                                        <AlertDialogTitle className="text-black dark:text-white text-2xl text-center">Are you sure you want to log out?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-center">
                                            You will log out from {user.email}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSignOut} className="w-full">Log out</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
