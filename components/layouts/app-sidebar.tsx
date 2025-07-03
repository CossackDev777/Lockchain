"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaWallet } from "react-icons/fa";
import { LuFileText } from "react-icons/lu";
import { BiHelpCircle } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Contracts",
      path: "/contracts",
      icon: <LuFileText className="h-5 w-5 text-white" />,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: <FaWallet className="h-5 w-5 text-white" />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <BiHelpCircle className="h-5 w-5 text-white" />,
    },
  ];

  const renderNavItem = (item: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }) => (
    <li key={item.name}>
      <Link
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition ${
          pathname === item.path
            ? "bg-[#00d0ff]/10 text-[#00d0ff] border border-[#00d0ff]/20"
            : "text-white hover:bg-white/5"
        }`}
      >
        {item.icon}
        <span className="font-medium">{item.name}</span>
      </Link>
    </li>
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0e0f11] flex flex-col z-10 md:flex">
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center">
          <div
            className="relative h-9 w-9"
            style={{ filter: "drop-shadow(0 0 4px rgba(0, 200, 255, 0.5))" }}
          >
            <Image
              src="/new-lockup-logo.png"
              alt="LockUp Logo"
              fill
              style={{
                objectFit: "contain",
                filter:
                  "brightness(0) saturate(100%) invert(67%) sepia(86%) saturate(1242%) hue-rotate(165deg) brightness(101%) contrast(101%)",
              }}
              priority
            />
          </div>
          <span className="font-medium text-white text-xl ml-3">LockUp</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">{navItems.map(renderNavItem)}</ul>
      </nav>

      <div className="px-4 py-6 mt-auto border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-white rounded-xl transition hover:bg-white/5">
          <FiLogOut className="h-5 w-5 text-white" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
