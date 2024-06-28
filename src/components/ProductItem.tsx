"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";
import { type Schema } from "@/../amplify/data/resource";
import { useEffect, useState } from "react";

type Product = Schema["Product"]["type"];
interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { authStatus } = useAuthenticator();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsSignedIn(authStatus === "authenticated");
    }
  }, [authStatus]);

  return (
    <div>
      <div>{product.name}</div>
      <div>Is signed in? {isSignedIn ? "Yes" : "No"}</div>
    </div>
  );
};
export default ProductItem;
