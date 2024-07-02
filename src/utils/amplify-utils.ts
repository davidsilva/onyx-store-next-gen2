import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "@/../amplify_outputs.json";
import { cookies } from "next/headers";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth/server";
import { type Schema } from "@/../amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const checkIsAuthenticated = async (): Promise<boolean> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await getCurrentUser(contextSpec);
        return !!user;
      } catch (error) {
        return false;
      }
    },
  });
};

export const checkIsAdmin = async (): Promise<boolean> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      let isAdmin = false;
      try {
        const session = await fetchAuthSession(contextSpec);
        const tokens = session.tokens;
        if (tokens && Object.keys(tokens).length > 0) {
          const groups = tokens.accessToken.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("Admins")) {
            isAdmin = true;
          }
        }
        return isAdmin;
      } catch (error) {
        return false;
      }
    },
  });
};

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
  authMode: "iam",
});
