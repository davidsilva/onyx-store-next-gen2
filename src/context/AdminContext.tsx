"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import clearCachesByServerAction from "@/actions/revalidate";

interface AdminContextProviderProps {
  children: React.ReactNode;
}

export type AdminContextType = {
  isAdmin: boolean;
};

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminContextProvider: React.FC<AdminContextProviderProps> = ({
  children,
}) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("signedIn");
          setIsSignedIn(true);
          clearCachesByServerAction();
          break;
        case "signedOut":
          console.log("signedOut");
          setIsSignedIn(false);
          clearCachesByServerAction();
          break;
      }
    });

    return () => {
      hubListenerCancelToken();
    };
  }, []);

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsSignedIn(authStatus === "authenticated");
    }
  }, [authStatus]);

  useEffect(() => {
    const checkAdmin = async () => {
      let admin = false;
      try {
        const session = await fetchAuthSession();
        const tokens = session.tokens;
        if (tokens && Object.keys(tokens).length > 0) {
          const groups = tokens.accessToken.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("Admins")) {
            admin = true;
          }
        }
      } catch (error) {
        admin = false;
      } finally {
        setIsAdmin(admin);
      }
    };

    if (isSignedIn) {
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn]);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};
