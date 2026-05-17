import { NextRequest, NextResponse } from "next/server";

// Pages everyone can access WITHOUT login
const publicRoutes = ["/", "/login", "/about", "/ZoneOfficer/SignUp"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // No token → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Apply middleware to all routes except static files
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};