import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarClient from "@/components/NavbarClient";
import PusherNotification from "@/components/PusherNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zone Officer Portal",
  description: "City complaint management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">

        {/* ── Navbar ── */}
        <NavbarClient />

        {/* ✅ Pusher Beams — runs in background, registers for notifications */}
        <PusherNotification />

        {/* ── Page content ── */}
        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}