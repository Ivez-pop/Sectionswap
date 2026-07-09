"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import SocializBadge from "@/components/SocializBadge";
import { signOut } from "@/app/actions/auth";

export interface NavbarProps {
  isAdmin: boolean;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export default function Navbar({
  isAdmin,
  fullName,
  email,
  avatarUrl,
}: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/section-swap", label: "Section Swap" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Side Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo/logo.jpeg"
            alt="KIIT Hub Community Logo"
            width={48}
            height={48}
            priority
            quality={100}
            className="h-12 w-12 shrink-0 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
          />
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
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Action Group */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-sm active:scale-[0.95]"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 animate-in spin-in-90 duration-300" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 animate-in spin-in-90 duration-300" />
            )}
          </button>

          {/* Profile name */}
          <div
            className="hidden max-w-[160px] truncate text-xs font-medium text-zinc-500 sm:block dark:text-zinc-400"
            title={email ?? undefined}
          >
            {fullName || email}
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={fullName ?? "Profile"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="h-4.5 w-4.5" />
            )}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 shadow-sm transition-colors hover:bg-zinc-100 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
