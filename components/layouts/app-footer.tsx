"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export function AppFooter() {
  const pathname = usePathname()
  const shouldHideFooter = ["/contracts", "/wallet", "/support"].some(
    (path) => pathname === path || pathname?.startsWith(path + "/"),
  )
  if (shouldHideFooter) {
    return <div className="hidden"></div>
  }

  return (
    <footer className="border-t border-brand-border py-10 bg-[#0e0f11] text-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center">
              <Image src="/logo/lockup-logo.png" alt="LockUp" width={28} height={28} className="h-7 w-auto" priority/>
              <span className="ml-2 text-white font-medium text-lg">LockUp</span>
            </div>
            <p className="text-sm mt-2 text-center md:text-left max-w-xs">
              Secure, trustless payments on the Stellar blockchain.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com/YOUR_REPO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </Link>
              <Link
                href="https://x.com/LockUpFinance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/lockupfinance/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </Link>
            </div>
            <Link href="/docs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Documentation
            </Link>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-800">
          © 2025 LockUp, built by Cordillera.
        </div>
      </div>
    </footer>
  )
}
