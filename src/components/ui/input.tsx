import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  // "flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:dark:text-zinc-500 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none focus-visible:outline focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-9 text-base",
        lg: "h-10 text-lg",
      },
      variant: {
        default: "border-input dark:border-zinc-700",
        primary: "border-zinc-300 dark:border-zinc-800",
        editor: "bg-zinc-900 border border-zinc-700",
        danger: "border-red-500 focus-visible:outline-red-500",
        success: "border-green-500 focus-visible:outline-green-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
