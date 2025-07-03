import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div
        className={cn(
          "bg-[#15171d] rounded-xl border border-gray-800 shadow-sm transition hover:shadow-md overflow-hidden w-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
