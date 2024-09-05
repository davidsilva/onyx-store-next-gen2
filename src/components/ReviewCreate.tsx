"use client";

import { generateClient } from "@aws-amplify/api";
import { Card, Alert, Text } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { type Review, type Message } from "@/types";
import ReviewForm from "./ReviewForm";
import { useAuthenticator } from "@aws-amplify/ui-react";

type FormData = {
  title: string;
  rating: string;
  content: string;
};

const client = generateClient<Schema>({ authMode: "userPool" });

const ReviewCreate = ({ productId }: { productId: string }) => {
  const [review, setReview] = useState<Review | null>(null);
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
      setUserId(user.userId);
    }
  }, [authStatus, user]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await client.models.Review.create({
        title: data.title,
        rating: parseInt(data.rating, 10),
        content: data.content,
        productId: productId,
        userId: userId,
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
      <h1>Review Create</h1>
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
