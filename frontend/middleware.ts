import { NextRequest, NextResponse } from "next/server";

// Pages that do NOT require login
const publicRoutes = ["/", "/login", "/ZoneOfficer/SignUp"];

// Pages logged-in users should NOT visit
const authRoutes = ["/login", "/ZoneOfficer/SignUp"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // If logged in and visiting login/signup → redirect to dashboard
    if (token && authRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/ZoneOfficer/Dashboard", request.url));
    }

    // If NOT logged in and visiting protected page → redirect to login
    if (!token && !publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/LogIn", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};