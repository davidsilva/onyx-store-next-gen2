"use client";

import { generateClient } from "@aws-amplify/api";
import { Card, Alert, Text } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { type Review, type Message } from "@/types";
import ReviewForm from "./ReviewForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AsyncProcess, AsyncProcessStatus } from "@/types";

type FormData = {
  title: string;
  rating: string;
  content: string;
};

const client = generateClient<Schema>({ authMode: "userPool" });

const ReviewEdit = ({ reviewId }: { reviewId: string }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<
    AsyncProcess<Review, Error>
  >({
    status: AsyncProcessStatus.NONE,
  });
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchReview = async () => {
      setLoadingStatus({ status: AsyncProcessStatus.PENDING });
      try {
        const result = await client.models.Review.get(
          { id: reviewId },
          {
            selectionSet: [
              "id",
              "title",
              "rating",
              "content",
              "userId",
              "productId",
            ],
            authMode: authStatus === "authenticated" ? "userPool" : "iam",
          }
        );

        console.log("result", result);
        if (result.data) {
          setReview(result.data);
          setLoadingStatus({
            status: AsyncProcessStatus.SUCCESS,
            value: result.data,
          });
        } else {
          setLoadingStatus({
            status: AsyncProcessStatus.ERROR,
            error: new Error("Review not found"),
          });
        }
      } catch (error) {
        console.error("error fetching review", error);
        if (error instanceof Error) {
          setLoadingStatus({ status: AsyncProcessStatus.ERROR, error: error });
        } else {
          setLoadingStatus({
            status: AsyncProcessStatus.ERROR,
            error: new Error("Error fetching review"),
          });
        }
      }
    };

    if (authStatus !== "configuring") {
      setIsAuthenticated(authStatus === "authenticated");
      setUserId(user.userId);

      fetchReview();
    }
  }, [authStatus, user, reviewId]);

  const onSubmit = async (data: FormData) => {
    if (!review || !userId) {
      throw new Error("Review or userId is null");
    }

    try {
      const result = await client.models.Review.update({
        id: reviewId,
        title: data.title,
        rating: parseInt(data.rating, 10),
        content: data.content,
        productId: review.productId,
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

  if (!isAuthenticated || !userId) {
    return (
      <Alert variation="error">You must be signed in to leave a review.</Alert>
    );
  }

  if (loadingStatus.status === AsyncProcessStatus.PENDING) {
    return <Text>Loading...</Text>;
  }

  if (loadingStatus.status === AsyncProcessStatus.ERROR) {
    return (
      <Alert variation="error">
        Error loading review: {loadingStatus.error?.message}
      </Alert>
    );
  }

  return (
    <Card>
      <h1>Review Create</h1>
      {message && <Alert variation={message.type}>{message.content}</Alert>}

      {!message && review?.productId && (
        <ReviewForm
          onSubmit={onSubmit}
          review={review}
          setReview={setReview}
          productId={review?.productId}
          userId={userId}
        />
      )}
      {!message && !review?.productId && <Text>Product ID is missing.</Text>}
    </Card>
  );
};
export default ReviewEdit;
