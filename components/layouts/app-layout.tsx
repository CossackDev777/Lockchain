"use client";

import { usePathname } from "next/navigation";
import { LuFileText } from "react-icons/lu";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { useState } from "react";
import { DashFooter } from "@/components/layouts/dash-footer";
import { CreateContractDrawer } from "@/components/ui/contract-create";
import { useWallet } from "../wallet-provider";

interface WebAppLayoutProps {
  children: React.ReactNode;
}

const HIDDEN_BUTTON_PAGES = [
  "/help",
  "/create-contract",
  "/contract/",
  "/invite/",
];
const PAGE_TITLES: Record<string, string> = {
  "/contracts": "Your Contracts",
  "/templates": "Contract Templates",
  "/wallet": "Wallet Overview",
  "/support": "Support Center",
  "/settings": "Settings",
  "/": "Dashboard",
  "/contract/": "Contract Details",
};
const HIDE_FOOTER_PATHS = ["/contracts", "/wallet", "/support"];

export function AppLayout({ children }: WebAppLayoutProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const shouldHideButton = HIDDEN_BUTTON_PAGES.some(
    (page) =>
      pathname === page || (page.endsWith("/") && pathname?.startsWith(page))
  );

  const shouldHideFooter = HIDE_FOOTER_PATHS.some(
    (path) => pathname === path || pathname?.startsWith(path)
  );

  const getPageTitle = () => {
    if (PAGE_TITLES[pathname || ""]) {
      return PAGE_TITLES[pathname || ""];
    }

    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (pathname?.startsWith(path) && path !== "/") {
        return title;
      }
    }

    return "Dashboard";
  };

  const { connectWallet, isConnectedState, publicKey, error, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-grid-pattern bg-[#0B0F19]">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <MobileNav onCreateContract={() => setIsDrawerOpen(true)} />

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 w-full flex flex-col">
        <header className="fixed md:left-64 left-0 right-0 md:top-0 top-16 md:z-[90] z-[30] flex items-center justify-between bg-[#0e0f11] px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-800 shadow-md">
          <div className="flex items-center space-x-2 text-white text-base sm:text-lg font-semibold">
            <LuFileText size={18} className="sm:w-5 sm:h-5" />
            <span>{getPageTitle()}</span>
          </div>

          {!shouldHideButton && (
            <div className="flex items-center space-x-2">
              {isConnectedState && publicKey ? (
                <button
                  className="hidden sm:block bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded"
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  className="hidden sm:block bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded"
                  onClick={handleConnect}
                >
                  Connect Wallet
                </button>
              )}
              <button
                className="hidden sm:block bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded"
                onClick={() => setIsDrawerOpen(true)}
              >
                + New Contract
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 pt-14">
          <div className="max-w-screen mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 w-full">
            {children}
          </div>
        </div>

        <div className={shouldHideFooter ? "hidden" : ""}>
          <DashFooter />
        </div>
      </main>

      <CreateContractDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
