"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarClient() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            setIsLoggedIn(true);
            const parsed = JSON.parse(user);
            setUserName(parsed.name || parsed.email || "Officer");
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        router.push("/login");
    }

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Brand */}
                <Link
                    href="/"
                    className="font-bold text-green-600 text-lg tracking-tight hover:opacity-80 transition-opacity"
                >
                    🌿 ZonePortal
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/ZoneOfficer">Zone Officers</NavLink>
                    <NavLink href="/ZoneOfficer/SignUp">Sign Up</NavLink>
                    <NavLink href="/ZoneOfficer/Complaint/CreateComplain">Create Complaint</NavLink>
                    <NavLink href="/ZoneOfficer/Complaint/EditComplain">Edit Complaint</NavLink>

                    {/* Login / Logout */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3 ml-3">
                            <span className="text-sm text-gray-600 font-medium">
                                👤 {userName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-md text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium border border-red-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-3 px-4 py-1.5 rounded-md text-sm text-white bg-green-600 hover:bg-green-700 transition-colors font-medium"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors font-medium"
        >
            {children}
        </Link>
    );
}