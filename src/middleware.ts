import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// if there is a session token, redirect to / (home)
export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    if (req.nextUrl.pathname === "/publicar" && !token)
        return NextResponse.redirect(new URL("/login", req.url));
    if (req.nextUrl.pathname === "/login" && token)
        return NextResponse.redirect(new URL("/", req.url));

    return NextResponse.next();
}

export const config = { matcher: ["/login", "/publicar"] };
