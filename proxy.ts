import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ VERY IMPORTANT: don't touch static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  ) {
    console.log("api detected, skipping auth check for:", pathname);
    return NextResponse.next();
  }
console.log("continue");
  // const session = await getSession();

  // const isSignInPage = pathname.startsWith("/auth/sign-in");
  // const isSignUpPage = pathname.startsWith("/auth/sign-up");
  // const isHomePage = pathname === "/";

  // if ((isSignInPage || isSignUpPage) && session?.user) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if (!session?.user && !(isHomePage || isSignInPage || isSignUpPage)) {
  //   return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  // }

   return NextResponse.next();
}
