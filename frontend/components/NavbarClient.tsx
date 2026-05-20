// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function NavbarClient() {
//     const router = useRouter();
//     const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//     const [userName, setUserName] = useState<string>("");

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const user = localStorage.getItem("user");
//         if (token && user) {
//             setIsLoggedIn(true);
//             const parsed = JSON.parse(user);
//             setUserName(parsed.name || parsed.email || "Officer");
//         }
//     }, []);

//     function handleLogout() {
//         // Clear localStorage
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         // Clear cookie so middleware also logs out
//         document.cookie = "token=; path=/; max-age=0";
//         setIsLoggedIn(false);
//         router.push("/login");
//     }

//     return (
//         <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
//             <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

//                 <Link
//                     href="/"
//                     className="font-bold text-green-600 text-lg tracking-tight hover:opacity-80 transition-opacity"
//                 >
//                     🌿 ZonePortal
//                 </Link>

//                 <div className="flex items-center gap-1">
//                     <NavLink href="/">Home</NavLink>

//                     {isLoggedIn ? (
//                         <>
//                             <NavLink href="/ZoneOfficer">Zone Officers</NavLink>
//                             <NavLink href="/ZoneOfficer/Complaint/CreateComplain">Create Complaint</NavLink>
//                             <NavLink href="/ZoneOfficer/Complaint/EditComplain">Edit Complaint</NavLink>
//                             <div className="flex items-center gap-3 ml-3">
//                                 <span className="text-sm text-gray-600 font-medium">
//                                     👤 {userName}
//                                 </span>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="px-3 py-1.5 rounded-md text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium border border-red-200"
//                                 >
//                                     Logout
//                                 </button>
//                             </div>
//                         </>
//                     ) : (
//                         // Not logged in show only login and signup
//                         <>
//                             <NavLink href="/ZoneOfficer/SignUp">Sign Up</NavLink>
//                             <Link
//                                 href="/login"
//                                 className="ml-3 px-4 py-1.5 rounded-md text-sm text-white bg-green-600 hover:bg-green-700 transition-colors font-medium"
//                             >
//                                 Login
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// }

// function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
//     return (
//         <Link
//             href={href}
//             className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors font-medium"
//         >
//             {children}
//         </Link>
//     );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
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
        document.cookie = "token=; path=/; max-age=0";
        setIsLoggedIn(false);
        router.push("/login");
    }

    return (
        <nav className="bg-slate-900 shadow-md px-10 py-5 flex justify-between items-center">
            {/* Brand */}
            <Link href="/">
                <h1 className="text-2xl font-bold text-indigo-400 leading-tight cursor-pointer hover:text-indigo-300 transition">
                    Dhaka Road & Drainage Issue Reporting System
                </h1>
            </Link>

            {/* Nav Links */}
            <ul className="flex gap-6 font-medium text-gray-200 items-center">
                {/* <li className="hover:text-blue-300 cursor-pointer transition">
                    <Link href="/">Home</Link>
                </li> */}
                {/* <li className="hover:text-blue-300 cursor-pointer transition">
                    <Link href="/About">About</Link>
                </li> */}

                {isLoggedIn ? (
                    // ── Logged in links ──
                    <>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/ZoneOfficer/Dashboard">Home</Link>
                        </li>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/ZoneOfficer">Zone Officers</Link>
                        </li>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/ZoneOfficer/Complaint/CreateComplain">Create Complaint</Link>
                        </li>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/ZoneOfficer/Complaint/EditComplain">Edit Complaint</Link>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-sm text-gray-300">
                                👤 {userName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    // ── Not logged in links ──
                    <>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/About">About</Link>
                        </li>
                        <li className="hover:text-blue-300 cursor-pointer transition">
                            <Link href="/ZoneOfficer/SignUp">Sign Up</Link>
                        </li>
                        <li>
                            <Link href="/login">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                                    Log In
                                </button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}