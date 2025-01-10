// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";

export function middleware(req: NextRequest) {
    console.log("Middleware called");
    console.log("Request URL: ", req.url);
    const token = req.cookies.get(ACCESS_TOKEN)?.value;
    console.log("Access Token: ", token);

    if (!token) {
        console.log("No token, redirecting to home page...");
        return NextResponse.redirect(new URL("/", req.url));
    }

   
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/workspace",
        "/onboarding/:path*", 
        "/onboarding"  
    ],
};
