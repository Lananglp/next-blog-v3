"use client";

import { RootState } from "@/lib/redux";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/context/sessionSlice";
import { logout } from "@/app/api/function/auth";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ModeToggle } from "./dark-mode-button";
import { BoxIcon, CircleAlert, MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

function Header() {
    const { user, isLogin } = useSelector((state: RootState) => state.session);
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    const dispatch = useDispatch();
    const { toast } = useToast();

    const handleSignOut = async () => {
        try {
            const res = await logout();
            if (res.data) {
                dispatch(handleLogout());
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
        <header className="sticky top-4 z-50 px-4">
            <nav className="relative max-w-screen-2xl mx-auto group backdrop-blur-sm bg-white dark:bg-zinc-900/50 rounded-2xl shadow-lg hover:shadow-blue-700/5 transition duration-500 mt-4">
                <div className="border border-zinc-200 dark:border-zinc-900 rounded-2xl px-4 py-2.5">
                    <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-2xl">
                        <div className={`w-3/4 mx-auto h-[1px] bg-transparent bg-gradient-to-r from-transparent via-zinc-200/30 to-transparent transition duration-500`} />
                    </div>
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex items-center divide-x divide-zinc-200 dark:divide-zinc-700">
                            <Link href="/" className="flex items-center gap-2 pe-4">
                                <div className="inline-block text-blue-500">
                                    <BoxIcon className="h-7 w-7 mb-0.5" />
                                </div>
                                <span className="text-lg font-medium whitespace-nowrap dark:text-white">
                                    {appName}
                                </span>
                            </Link>
                            <NavMenu />
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            {isLogin ? (
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center">
                                                <span className="hidden md:inline-block mr-2 text-sm font-medium text-zinc-800 dark:text-white cursor-pointer">
                                                    {user.email || "Unknown"}
                                                </span>
                                                <Image
                                                    unoptimized
                                                    width={64}
                                                    height={64}
                                                    className="w-8 h-8 rounded-full cursor-pointer"
                                                    src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                                                    alt="User Photo"
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <AlertDialog>
                                                    <AlertDialogTrigger className="w-full text-start text-sm font-medium text-red-500 hover:dark:bg-zinc-800 rounded px-2 py-1.5">
                                                        logout
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
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button type="button" variant={'ghost'} size={'icon'} className="flex xl:hidden"><MenuIcon /></Button>
                                        </SheetTrigger>
                                        <SheetContent className="flex justify-center items-center">
                                            <SheetHeader className="hidden">
                                                <SheetTitle></SheetTitle>
                                                <SheetDescription>
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="flex flex-col text-center gap-2">
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">Getting started</Link>
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">Components</Link>
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">Admin</Link>
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">Login</Link>
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">Register</Link>
                                                <Link href='/' className="block font-medium hover:scale-125 py-1 hover:py-4 transition-all hover:text-black hover:dark:text-white duration-300">About</Link>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                    {/* <button onClick={handleSignOut} type="button">
                                        Logout
                                    </button> */}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-zinc-800 dark:text-white hover:bg-zinc-50 focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:hover:bg-zinc-700 focus:outline-none dark:focus:ring-zinc-800"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;


const components: { title: string; href: string; description: string }[] = [
    {
      title: "Alert Dialog",
      href: "/docs/primitives/alert-dialog",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Hover Card",
      href: "/docs/primitives/hover-card",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Progress",
      href: "/docs/primitives/progress",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Scroll-area",
      href: "/docs/primitives/scroll-area",
      description: "Visually or semantically separates content.",
    },
    {
      title: "Tabs",
      href: "/docs/primitives/tabs",
      description:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
      title: "Tooltip",
      href: "/docs/primitives/tooltip",
      description:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
  ]
   
export function NavMenu() {
    return (
        <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <CircleAlert className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Beautifully designed components built with Radix UI and
                                            Tailwind CSS.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Admin
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            About
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Login
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/register" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Register
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href="#"
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"