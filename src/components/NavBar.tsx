"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  const { authStatus } = useAuthenticator();
  const [authCheck, setAuthCheck] = useState<boolean>(false);
  const [adminCheck, setAdminCheck] = useState<boolean>(false);

  useEffect(() => {
    if (authStatus !== "configuring") {
      setAuthCheck(authStatus === "authenticated");
    }
  }, [authStatus]);

  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      let isAdmin = false;
      try {
        const session = await fetchAuthSession();
        const tokens = session.tokens;
        if (tokens && Object.keys(tokens).length > 0) {
          const groups = tokens.accessToken.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("Admins")) {
            isAdmin = true;
          }
        }
      } catch (error) {
        isAdmin = false;
      } finally {
        setAdminCheck(isAdmin);
      }
    };

    if (authCheck) {
      checkAdmin();
    } else {
      setAdminCheck(false);
    }
  }, [authCheck]);

  const signOutSignIn = async () => {
    if (authCheck) {
      await signOut();
    } else {
      router.push("/signin");
    }
  };

  const defaultRoutes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/admin/product-create",
      label: "Add Product",
      isAdmin: true,
    },
  ];

  const routes = defaultRoutes.filter((route) => {
    return route.isAdmin === adminCheck || route.isAdmin === undefined;
  });

  return (
    <div className={className}>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <Flex as="nav" alignItems="center" gap="3rem" margin="0 2rem">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
            </Link>
          ))}
        </Flex>
        <Button
          variation="primary"
          borderRadius="2rem"
          className="mr-4"
          onClick={signOutSignIn}
        >
          {authCheck ? "Sign Out" : "Sign In"}
        </Button>
      </Flex>
      <Divider size="small"></Divider>
    </div>
  );
}
