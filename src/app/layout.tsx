import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavbarServer from "@/components/NavbarServer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "KIIT Hub Community - Section Swap",
  description: "Find students who have or need your section and swap or connect with them effortlessly at KIIT.",
};

/** Skeleton shown while the auth-backed NavbarServer streams in. */
function NavSkeleton() {
  return (
    <div className="h-[60px] border-b border-[var(--kh-line)] bg-[color-mix(in_srgb,var(--kh-paper)_82%,transparent)] backdrop-blur-md" />
  );
}

/** Minimal page-content fallback — not a full screen, so layout stays put. */
function PageFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--kh-mut)]" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${hankenGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--kh-paper)] text-[var(--kh-ink)] transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar is layout-level — stays mounted across navigations */}
          <Suspense fallback={<NavSkeleton />}>
            <NavbarServer />
          </Suspense>

          {/* Only the page content streams — no full-screen spinner */}
          <Suspense fallback={<PageFallback />}>
            {children}
          </Suspense>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
