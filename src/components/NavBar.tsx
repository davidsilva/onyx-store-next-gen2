"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Flex } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useAdminContext } from "@/context/AdminContext";
import { type Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

interface NavBarProps {
  className?: string;
}

const client = generateClient<Schema>();

export default function NavBar({ className }: NavBarProps) {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);

  const { isAdmin } = useAdminContext();

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsAuthenticated(authStatus === "authenticated");
    }
  }, [authStatus]);

  useEffect(() => {
    const fetchUserDisplayName = async () => {
      console.log("fetchUserDisplayName user", user);
      const result = await client.models.UserProfile.listUserProfileByUsername(
        { username: user.username },
        { authMode: "userPool" }
      );

      const resultList = await client.models.UserProfile.list({
        authMode: "userPool",
      });
      console.log("fetchUserDisplayName resultList", resultList);

      console.log("fetchUserDisplayName result", result);

      if (!result.data || result.data.length === 0) {
        setUserDisplayName(user.username);
        return;
      }
      setUserDisplayName(
        result.data[0].preferredUsername ||
          result.data[0].email ||
          user.username
      );
    };

    if (authStatus === "authenticated" && user?.username) {
      fetchUserDisplayName();
    } else {
      setUserDisplayName(null);
    }
  }, [authStatus, user, isAuthenticated]);

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
    {
      href: "/admin/dashboard",
      label: "Dashboard",
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
        <Flex gap="1rem" alignItems="center">
          {userDisplayName && (
            <Flex>
              <Link href={`/user/${user.userId}`}>{userDisplayName}</Link>
            </Flex>
          )}
          <Button
            variation="primary"
            borderRadius="2rem"
            className="mr-4"
            onClick={signOutSignIn}
          >
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
