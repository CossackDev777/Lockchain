"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashFooter() {
  const pathname = usePathname()
  const shouldHideFooter = ["/contracts", "/wallet", "/support"].some(
    (path) => pathname === path || pathname?.startsWith(path + "/"),
  )
  if (shouldHideFooter) {
    return <div className="hidden"></div>
  }

  return (
    <footer className="mt-auto border-t border-neutral-800 bg-[#0e0f11] py-4 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400">
        <div className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Stellar Development Foundation. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/help" className="hover:text-white transition-colors">
            Help
          </Link>
        </div>
      </div>
    </footer>
  )
}
