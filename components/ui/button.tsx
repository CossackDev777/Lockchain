"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { FaArrowRight } from "react-icons/fa";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-brand",
        destructive:
          "rounded-md bg-brand-error/20 backdrop-blur-sm border border-brand-error/30 text-brand-error hover:bg-brand-error/30 font-medium",
        outline:
          "rounded-md border border-gray-700 text-white hover:bg-[#1e293b] font-medium",
        secondary:
          "rounded-md bg-[#1e293b] backdrop-blur-sm border border-gray-800 text-white hover:bg-[#2a3749] font-medium",
        ghost: "rounded-md hover:bg-[#1e293b] text-gray-400 hover:text-white",
        link: "text-[#00d0ff] hover:underline font-medium p-0 h-auto",
        solid: "btn-brand-solid",
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-1 text-xs",
        lg: "px-8 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      showArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {showArrow && <FaArrowRight className="ml-2 h-4 w-4" />}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
