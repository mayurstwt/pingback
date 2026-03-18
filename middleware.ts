import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Paths that should never be indexed by search engines. */
const NOINDEX_PREFIXES = ["/setup/", "/dashboard", "/api/"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const shouldNoindex = NOINDEX_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix),
    );

    if (shouldNoindex) {
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
