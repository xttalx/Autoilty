import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://autoilty.com"),
  title: {
    default: "Autoilty — Hyperlocal Automotive Marketplace",
    template: "%s | Autoilty"
  },
  description:
    "Autoilty is the hyperlocal, trust-first automotive marketplace for Canada, India, Pakistan, China, and Bangladesh. Discover verified cars, parts, services with AI pricing and escrow.",
  alternates: {
    canonical: "https://autoilty.com"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Autoilty"
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

