"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductItemControlsProps {
  id: string;
}

const ProductItemControls = ({ id }: ProductItemControlsProps) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/product-edit/${id}`);
  };

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsSignedIn(authStatus === "authenticated");
    }
  }, [authStatus]);

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
        setIsAdmin(isAdmin);
      }
    };

    if (isSignedIn) {
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return (
      <div>
        <button className="btn btn-blue">Add Review</button>
        {isAdmin && (
          <div>
            <button className="btn btn-blue" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn btn-blue">Delete</button>
          </div>
        )}
      </div>
    );
  }
};

export default ProductItemControls;
