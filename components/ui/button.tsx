import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-transparent transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] px-5 py-3 text-[var(--primary-foreground)] hover:translate-y-[-1px] hover:opacity-95",
        secondary:
          "bg-[var(--secondary)] px-5 py-3 text-[var(--secondary-foreground)] hover:bg-[#1a2b4e]",
        ghost: "px-4 py-3 text-[var(--foreground)] hover:bg-white/8",
        outline:
          "border border-white/10 bg-white/0 px-5 py-3 text-[var(--foreground)] hover:bg-white/6",
        destructive:
          "bg-[var(--destructive)] px-5 py-3 text-[var(--destructive-foreground)] hover:opacity-90",
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
