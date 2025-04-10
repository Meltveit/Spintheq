import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpinTheQ - Party Games Platform",
  description: "Ultimate platform for spin the bottle, truth or dare, and party challenges",
  keywords: ["party games", "spin the bottle", "truth or dare", "games", "party", "challenge"],
  authors: [{ name: "SpinTheQ Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3182ce" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}