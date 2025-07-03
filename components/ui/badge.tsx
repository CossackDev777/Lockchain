import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 status-pill",
  {
    variants: {
      variant: {
        default: "status-pill status-pill-active",
        secondary: "bg-[#1e293b] text-white",
        destructive: "status-pill bg-brand-error/10 text-brand-error",
        outline: "text-white border border-gray-700",
        pending: "status-pill status-pill-pending",
        active: "status-pill status-pill-active",
        completed: "status-pill status-pill-completed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
