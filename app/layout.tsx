import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";

const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "LockUp — Smart Contract Escrow on Stellar",
  description:
    "LockUp is a trustless smart contract escrow platform built on Stellar. Create, manage, and release payments securely and transparently.",
  metadataBase: new URL("https://lockup.finance"),
  openGraph: {
    title: "LockUp — Smart Contract Escrow",
    description:
      "LockUp is a trustless smart contract escrow platform built on Stellar. Create, manage, and release payments securely and transparently.",
    url: "https://lockup.finance",
    siteName: "LockUp",
    images: [
      {
        url: "/new-lockup-logo.png",
        width: 1200,
        height: 630,
        alt: "LockUp - Smart Contract Escrow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LockUp — Smart Contract Escrow",
    description:
      "LockUp is a trustless smart contract escrow platform built on Stellar. Create, manage, and release payments securely and transparently.",
    images: ["/new-lockup-logo.png"],
    creator: "@lockupfinance",
    site: "@lockupfinance",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lockup.finance",
  },
  keywords: [
    "smart contracts",
    "stellar",
    "soroban",
    "blockchain",
    "escrow",
    "payments",
    "milestone payments",
  ],
  applicationName: "LockUp",
  referrer: "origin-when-cross-origin",
  creator: "LockUp Finance",
  publisher: "LockUp Finance",
  category: "Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0066FF" />
      </head>
      <body
        className={`${inter.className} overflow-x-hidden bg-grid-pattern bg-brand-background text-white`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
