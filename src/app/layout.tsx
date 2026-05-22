/**
 * 📌 next/font — Optimized Font Loading
 * 
 * WHY: next/font self-hosts Google Fonts at build time.
 * - No external network request to fonts.googleapis.com
 * - Zero layout shift (CLS = 0) because the fallback font metrics match
 * - font-display: swap is applied automatically
 * - Preload link injected into <head> automatically
 * 
 * HOW TO SEE THE EFFECT:
 * 1. Open DevTools → Network tab
 * 2. Filter by "Font"
 * 3. You'll see the font served from /_next/static/media/ — NOT from Google
 * 4. Run Lighthouse → CLS score will be 0 due to font optimization
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// Inter is a variable font — no need to specify weight (covers 100–900)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",          // Show fallback font immediately, swap when loaded
  variable: "--font-inter", // Expose as CSS variable for Tailwind/CSS use
});

/**
 * 📌 Metadata API — Root-level SEO
 * 
 * HOW TO SEE:
 * - View source of any page → check <head> for <title> and <meta> tags
 * - Paste any URL into https://opengraph.xyz to see the social preview card
 */
export const metadata: Metadata = {
  // Title template: child pages use "%s | HireSync CRM"
  title: {
    default: "HireSync Recruitment CRM",
    template: "%s | HireSync CRM",
  },
  description:
    "HireSync — The modern recruitment CRM to manage candidates, jobs, interviews, and hiring workflows in one place.",
  keywords: ["recruitment", "CRM", "hiring", "HR", "candidates", "jobs"],
  authors: [{ name: "HireSync Team" }],
  // OpenGraph — controls LinkedIn/WhatsApp/Facebook preview cards
  openGraph: {
    type: "website",
    siteName: "HireSync Recruitment CRM",
    title: "HireSync Recruitment CRM",
    description:
      "Manage candidates, jobs, and recruitment workflows seamlessly.",
    locale: "en_US",
  },
  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "HireSync Recruitment CRM",
    description:
      "Manage candidates, jobs, and recruitment workflows seamlessly.",
  },
  // Prevent search engines from indexing admin pages globally
  // (overridden per-page for public pages)
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * Apply the Inter font class to <html>
     * The inter.className injects the font-family CSS variable
     * The inter.variable exposes --font-inter CSS variable for Tailwind
     */
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${inter.className}`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
