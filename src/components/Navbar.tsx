"use client";

import Link from "next/link";
import { GraduationCap, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import SocializBadge from "@/components/SocializBadge";

export default function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useApp();

  const isHomeActive = pathname === "/";
  const isSectionSwapActive = pathname === "/section-swap";
  const isAdminActive = pathname === "/admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Side Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-700">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold leading-tight text-zinc-900 dark:text-zinc-50">
              KIIT Hub Community
            </span>
            <div className="mt-1 flex">
              <SocializBadge size="xs" />
            </div>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className={`relative text-sm font-semibold transition-colors duration-200 ${
              isHomeActive
                ? "text-blue-600 dark:text-blue-500"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            Home
            {isHomeActive && (
              <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </Link>
          <Link
            href="/section-swap"
            className={`relative text-sm font-semibold transition-colors duration-200 ${
              isSectionSwapActive
                ? "text-blue-600 dark:text-blue-500"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            Section Swap
            {isSectionSwapActive && (
              <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`relative text-sm font-semibold transition-colors duration-200 ${
                isAdminActive
                  ? "text-blue-600 dark:text-blue-500"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              Admin
              {isAdminActive && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
              )}
            </Link>
          )}
        </nav>

        {/* Right Side Profile Avatar */}
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-sm">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
