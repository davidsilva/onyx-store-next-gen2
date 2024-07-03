"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useAdminContext } from "@/context/AdminContext";

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isAdmin } = useAdminContext();

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsAuthenticated(authStatus === "authenticated");
    }
  }, [authStatus]);

  const router = useRouter();

  const signOutSignIn = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      router.push("/signin");
    }
  };

  const defaultRoutes = [
    {
      href: "/",
      label: "Onyx Store",
    },
    {
      href: "/admin/product-create",
      label: "Add Product",
      isAdmin: true,
    },
  ];

  const routes = defaultRoutes.filter((route) => {
    return route.isAdmin === isAdmin || route.isAdmin === undefined;
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
          {isAuthenticated ? "Sign Out" : "Sign In"}
        </Button>
      </Flex>
    </div>
  );
}
