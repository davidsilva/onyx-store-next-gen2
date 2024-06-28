/* 
If user tries to access the /admin path he must be authenticated and an admin.
*/
import { NextRequest, NextResponse } from "next/server";

import { fetchAuthSession } from "aws-amplify/auth/server";

import { runWithAmplifyServerContext } from "@/utils/amplify-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const isAdmin = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        const tokens = session.tokens;
        if (tokens && Object.keys(tokens).length > 0) {
          const groups = tokens.accessToken.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("Admins")) {
            return true;
          }
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

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
