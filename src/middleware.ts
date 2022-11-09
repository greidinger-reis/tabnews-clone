import { withAuth } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";

// if there is a session, redirect to / (home)
export default withAuth(
    function middleware(req: NextRequest) {
        if (req.cookies.has("next-auth.session-token")) {
            console.log({
                status: "session exists",
            });
            return NextResponse.redirect(new URL("/", req.url));
        }
        console.log({
            status: "no session",
        });
        return NextResponse.next();
    },
    {
        callbacks: { authorized: () => true },
    }
);

export const config = { matcher: ["/login"] };
