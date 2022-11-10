import {type NextRequest, NextResponse} from "next/server";

// if there is a session, redirect to / (home)
export function middleware(req: NextRequest) {
    if (
        req.cookies.has("next-auth.session-token") ||
        req.cookies.has("__Secure-next-auth.session-token")
    ) {
        console.log({
            status: "session exists",
            cookies: req.cookies,
        });
        return NextResponse.redirect(new URL("/", req.url));
    }
    console.log({
        status: "no session",
        cookies: req.cookies,
    });
    return NextResponse.next();
}

export const config = {matcher: ["/login"]};
