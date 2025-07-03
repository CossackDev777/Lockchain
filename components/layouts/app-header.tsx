"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useEffect } from "react";

type NavItem = {
  name: string;
  path: string;
  isScroll?: boolean;
  isExternal?: boolean;
};

const marketingNavItems: NavItem[] = [
  { name: "Features", path: "/#features", isScroll: true },
  {
    name: "Documentation",
    path: "https://docs.lockup.finance",
    isExternal: true,
  },
  { name: "Support", path: "/support" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);


  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavItemClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.isScroll) {
      e.preventDefault();
      if (pathname === "/") {
        const featuresSection = document.getElementById("features");
        if (featuresSection) {
          const headerOffset = 72;
          const elementPosition = featuresSection.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      } else {
        router.push("/#features");
      }
    }
    setMenuState(false);
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const baseClasses = cn(
      "relative text-[#94A3B8] hover:text-white transition-all duration-200",
      "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#00C2FF] after:transition-all after:duration-200",
      "hover:after:w-full",
      isMobile && "block w-full py-2"
    );

    if (item.isExternal) {
      return (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {item.name}
        </a>
      );
    }

    if (item.isScroll) {
      return (
        <a
          href={item.path}
          onClick={(e) => handleNavItemClick(e, item)}
          className={baseClasses}
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link href={item.path} className={baseClasses}>
        {item.name}
      </Link>
    );
  };

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-50 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-[#0B0F19]/90 max-w-4xl rounded-xl border border-white/10 backdrop-blur-xl lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" className="flex items-center space-x-3 group">
                <Image
                  src="/logo/lockup-logo.png"
                  alt="LockUp"
                  width={48}
                  height={48}
                  className="transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(67%) sepia(86%) saturate(1242%) hue-rotate(165deg) brightness(101%) contrast(101%)",
                  }}
                  priority
                />
                <span className="text-xl font-bold text-white transition-colors duration-200 group-hover:text-[#00C2FF]">
                  LockUp
                </span>
              </Link>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white hover:text-[#00C2FF] transition-colors duration-200"
              >
                <FaBars
                  className={cn(
                    "m-auto size-6 duration-200",
                    menuState && "rotate-180 scale-0 opacity-0"
                  )}
                />
                <FaTimes
                  className={cn(
                    "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                    menuState && "rotate-0 scale-100 opacity-100"
                  )}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm font-medium">
                {marketingNavItems.map((item, index) => (
                  <li key={index}>{renderNavItem(item)}</li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "bg-[#0B0F19]/95 backdrop-blur-xl mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-xl border border-white/10 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                menuState ? "block" : "hidden",
                "lg:flex"
              )}
            >
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {marketingNavItems.map((item, index) => (
                    <li key={index} className="w-full">
                      {renderNavItem(item, true)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <button
                  onClick={() => router.push("/contracts")}
                  className="group relative bg-[#00C2FF]/10 backdrop-blur-sm border border-[#00C2FF]/30 text-[#00C2FF] hover:bg-[#00C2FF]/20 w-full sm:w-auto transition-all duration-300 rounded-md px-6 py-2.5 font-medium"
                >
                  <span className="relative z-10">Launch App</span>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#00C2FF]/20 to-[#00C2FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
