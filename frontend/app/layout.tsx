import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

            {/* Brand */}
            <Link
              href="/"
              className="font-bold text-blue-600 text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              🌿 ZonePortal
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/ZoneOfficer">Zone Officers</NavLink>
              <NavLink href="/ZoneOfficer/SignUp">Sign Up</NavLink>
              {/* <NavLink href="/ZoneOfficer/EditOfficer">Edit Officer</NavLink> */}
              <NavLink href="/ZoneOfficer/Complaint/CreateComplain">Create Complaint</NavLink>
              <NavLink href="/ZoneOfficer/Complaint/EditComplain">Edit Complaint</NavLink>
            </div>
          </div>
        </nav>

        {/* ── Page content ── */}
        <main className="flex-1">
          {children}
        </main>

        {/* ── Footer ── */}
        {/* <footer className="border-t border-gray-200 bg-white text-center py-4 text-xs text-gray-400">
          © {new Date().getFullYear()} ZonePortal · City Complaint Management
        </footer> */}

      </body>
    </html>
  );
}

// Small reusable nav link component
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
    >
      {children}
    </Link>
  );
}