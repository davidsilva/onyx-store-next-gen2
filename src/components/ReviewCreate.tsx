"use client";

import { generateClient } from "@aws-amplify/api";
import { Card, Alert, Text } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { type Review, type Message, ProductWithReviews } from "@/types";
import ReviewForm from "./ReviewForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ProductItem from "./ProductItem";

type FormData = {
  title: string;
  rating: string;
  content: string;
};

const client = generateClient<Schema>({ authMode: "userPool" });

const ReviewCreate = ({ productId }: { productId: string }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (authStatus !== "configuring") {
      setIsAuthenticated(authStatus === "authenticated");

      if (authStatus === "authenticated") {
        setUserId(user.userId);
      }
    }
  }, [authStatus, user]);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("fetchProduct productId", productId);
      const result = await client.models.Product.get(
        { id: productId },
        {
          selectionSet: [
            "id",
            "name",
            "description",
            "price",
            "images.*",
            "isActive",
            "mainImageS3Key",
            "reviews.*",
          ],
        }
      );

      console.log("fetchProduct result", result);
      setProduct(result.data);
    };

    if (authStatus === "authenticated") {
      fetchProduct();
    }
  }, [authStatus, productId]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await client.models.Review.create({
        title: data.title,
        rating: parseInt(data.rating, 10),
        content: data.content,
        productId: productId,
        userId: userId,
        sentimentProcessed: false,
      });

      console.log("review create result", result);

      setMessage({
        type: "success",
        content: "Review created successfully.",
      });
    } catch (error) {
      console.error("error creating review", error);

      setMessage({
        type: "error",
        content: "Error creating review.",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variation="error">You must be signed in to leave a review.</Alert>
    );
  }

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card>
      {product && (
        <ProductItem
          product={product}
          isSignedIn={isAuthenticated}
          showControls={false}
        />
      )}
      {message ? (
        <Alert variation={message.type}>{message.content}</Alert>
      ) : (
        <ReviewForm
          onSubmit={onSubmit}
          review={review}
          setReview={setReview}
          productId={productId}
          userId={userId}
        />
      )}
    </Card>
  );
};
export default ReviewCreate;
