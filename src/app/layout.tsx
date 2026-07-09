import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavbarServer from "@/components/NavbarServer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIIT Hub Community - Section Swap",
  description: "Find students who have or need your section and swap or connect with them effortlessly at KIIT.",
};

/** Skeleton shown while the auth-backed NavbarServer streams in. */
function NavSkeleton() {
  return (
    <div className="h-16 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/70" />
  );
}

/** Minimal page-content fallback — not a full screen, so layout stays put. */
function PageFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="h-5 w-5 animate-spin text-zinc-300 dark:text-zinc-600" />
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
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
