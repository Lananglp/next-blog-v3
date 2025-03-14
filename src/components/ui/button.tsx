import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 border border-transparent whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-none focus-visible:ring-ring outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        primary:
          "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50",
        // destructive:
        //   "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 border border-destructive",
        destructive:
          "bg-red-900 text-white shadow-sm hover:bg-red-800",
        editorToolBar:
          "hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50",
        editorBlockBar:
          "hover:bg-zinc-200 hover:dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-800",
        submit:
          "bg-blue-800 hover:bg-blue-700 border border-blue-800 text-white",
        outline:
          "border border-input dark:border-zinc-700 bg-background dark:bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger:
          "text-red-500 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50",
        transparent: "hover:bg-transparent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        editorToolBar: "w-8 h-8 rounded text-sm",
        editorBlockBar: "h-8 rounded text-xs px-2 py-0.5",
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        iconSm: "h-8 w-8",
        iconXs: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
