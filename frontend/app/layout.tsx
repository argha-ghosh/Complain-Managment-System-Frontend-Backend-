import type { Metadata } from "next";
import "./globals.css";
import LandingNavbar from "@/components/NavbarClient";
import PusherNotification from "@/components/PusherNotification";

export const metadata: Metadata = {
  title: "Dhaka Road & Drainage Issue Reporting System",
  description: "City complaint management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">

        <LandingNavbar />

        <PusherNotification />

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}