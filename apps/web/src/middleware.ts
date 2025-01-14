// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./config/constant/cookie";

export function middleware(req: NextRequest) {
 
    const token = req.cookies.get(ACCESS_TOKEN)?.value;
 

    if (!token) {
     
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
