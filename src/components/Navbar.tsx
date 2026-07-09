"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Sun, Moon, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";
import SocializBadge from "@/components/SocializBadge";
import ContactInfoModal from "@/components/ContactInfoModal";
import { signOut } from "@/app/actions/auth";

export interface NavbarProps {
  isAdmin: boolean;
  fullName: string | null;
  email: string | null;
  whatsappNumber: string | null;
  discordHandle: string | null;
}

export default function Navbar({
  isAdmin,
  fullName,
  email,
  whatsappNumber,
  discordHandle,
}: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const links = [
    { href: "/", label: "Communities" },
    { href: "/section-swap", label: "Section Swap" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const initial = (fullName || email || "?").trim().charAt(0).toUpperCase();

  // Login and auth-error screens are full-bleed and render their own chrome.
  if (pathname === "/login" || pathname.startsWith("/auth/")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--kh-line)] bg-[color-mix(in_srgb,var(--kh-paper)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1080px] items-center gap-[22px] px-[22px]">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="flex flex-col">
            <span className="font-serif text-[22px] leading-none tracking-tight text-[var(--kh-ink)]">
              KIIT Hub
            </span>
            <SocializBadge size="xs" className="mt-1" />
          </span>
        </Link>

        <nav className="ml-1.5 flex gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[9px] px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--kh-ink)] text-[var(--kh-paper)]"
                    : "text-[var(--kh-ink2)] hover:text-[var(--kh-ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setContactOpen(true)}
            title="Your contact info"
            aria-label="Your contact info"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--kh-line2)] bg-[var(--kh-card)] text-[var(--kh-ink2)] shadow-[0_2px_0_var(--kh-line2)] transition-transform hover:-translate-y-px cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            aria-label="Toggle theme"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--kh-line2)] bg-[var(--kh-card)] text-[var(--kh-ink2)] shadow-[0_2px_0_var(--kh-line2)] transition-transform hover:-translate-y-px cursor-pointer"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-[var(--kh-accent)]" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <div
            className="hidden text-right leading-[1.15] sm:block"
            title={email ?? undefined}
          >
            <div className="text-[13px] font-bold text-[var(--kh-ink)]">
              {fullName || email}
            </div>
            <div className="text-[11px] text-[var(--kh-mut)]">{email}</div>
          </div>

          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-sm font-extrabold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--kh-accent), var(--kh-need))",
            }}
          >
            {initial}
          </div>

          <form action={signOut}>
            <button
              type="submit"
              title="Sign out"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--kh-line2)] bg-[var(--kh-card)] text-[var(--kh-ink2)] transition-colors hover:text-[var(--kh-accent)] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {contactOpen && (
        <ContactInfoModal
          onClose={() => setContactOpen(false)}
          whatsappNumber={whatsappNumber}
          discordHandle={discordHandle}
        />
      )}
    </header>
  );
}
