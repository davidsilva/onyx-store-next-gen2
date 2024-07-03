/* 
If user tries to access the /admin path he must be authenticated and an admin.
*/
import { NextRequest, NextResponse } from "next/server";

import { checkIsAdmin } from "@/utils/amplify-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const isAdmin = await checkIsAdmin();

  console.log("isAdmin", isAdmin);

  if (isAdmin) {
    return response;
  }

  return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     */
    "/admin(/.*)?",
  ],
};
