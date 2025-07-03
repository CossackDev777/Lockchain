"use client";

import { useState, useEffect, useCallback, memo, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes, FaWallet, FaPlus } from "react-icons/fa";
import { LuFileText } from "react-icons/lu";
import { BiHelpCircle } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

interface MobileNavProps {
  onCreateContract?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Contracts",
    path: "/contracts",
    icon: <LuFileText className="h-5 w-5" />,
  },
  { name: "Wallet", path: "/wallet", icon: <FaWallet className="h-5 w-5" /> },
  {
    name: "Support",
    path: "/support",
    icon: <BiHelpCircle className="h-5 w-5" />,
  },
];

const CREATE_CONTRACT_BUTTON: NavItem = {
  name: "Create Contract",
  path: "/create-contract",
  icon: <FaPlus className="h-5 w-5" />,
};

const Logo = memo(() => (
  <div className="flex items-center space-x-3">
    <div
      className="relative h-8 w-8"
      style={{ filter: "drop-shadow(0 0 4px rgba(0, 200, 255, 0.5))" }}
    >
      <Image
        fill
        src="/new-lockup-logo.png"
        alt="LockUp Logo"
        style={{
          objectFit: "contain",
          filter:
            "brightness(0) saturate(100%) invert(67%) sepia(86%) saturate(1242%) hue-rotate(165deg) brightness(101%) contrast(101%)",
        }}
        priority
      />
    </div>
    <span className="font-bold text-xl text-white">LockUp</span>
  </div>
));
Logo.displayName = "Logo";

const NavLink = memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Link
      href={item.path}
      className={`flex items-center gap-3 px-4 py-3.5 text-base rounded-xl transition ${
        isActive
          ? "bg-[#00d0ff]/10 text-[#00d0ff] border border-[#00d0ff]/20"
          : "text-white hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      {item.icon}
      <span className="font-medium">{item.name}</span>
    </Link>
  )
);
NavLink.displayName = "NavLink";

export function MobileNav({ onCreateContract }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => closeMenu(), [pathname, closeMenu]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeMenu]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-16 bg-[#0e0f11] border-b border-neutral-800 flex items-center justify-between px-4 z-50 md:hidden shadow-md ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="mr-3 h-10 w-10 rounded-full hover:bg-[#1e293b] flex items-center justify-center"
          >
            <FaBars className="h-5 w-5 text-white" />
            <span className="sr-only">Open menu</span>
          </button>
          <Link href="/contracts" className="flex items-center">
            <Logo />
          </Link>
        </div>
        <button
          className="flex items-center justify-center gap-1 py-1.5 px-3 bg-cyan-500 text-white rounded-md text-sm font-medium"
          onClick={onCreateContract}
        >
          <FaPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Contract</span>
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] md:hidden transition-opacity duration-300 ease-in-out"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-[#0e0f11] z-[70] md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col h-full`}
        style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <Link
              href="/contracts"
              className="flex items-center"
              onClick={closeMenu}
            >
              <Logo />
            </Link>
            <button
              onClick={closeMenu}
              className="h-10 w-10 rounded-full text-white hover:bg-neutral-800"
            >
              <FaTimes className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="px-4 py-5">
            <button
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-cyan-500 text-white rounded-xl font-medium text-base"
              onClick={() => {
                closeMenu();
                onCreateContract?.();
              }}
            >
              {CREATE_CONTRACT_BUTTON.icon}
              <span>{CREATE_CONTRACT_BUTTON.name}</span>
            </button>
          </div>
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <NavLink
                    item={item}
                    isActive={pathname === item.path}
                    onClick={closeMenu}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-4 py-6 mt-auto border-t border-neutral-800">
            <button className="flex items-center gap-3 px-4 py-3.5 w-full text-left text-base text-white rounded-xl transition hover:bg-white/5">
              <FiLogOut className="h-5 w-5 text-white" />
              <span className="font-medium">Logout</span>
            </button>
            <a
              href="https://docs.lockup.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 w-full text-left text-base text-white rounded-xl transition hover:bg-white/5 mt-3"
            >
              <BiHelpCircle className="h-5 w-5 text-white" />
              <span className="font-medium">Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
