"use client";

import { generateClient } from "@aws-amplify/api";
import { Card, Alert, Text } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { ProductWithReviews, type Review } from "@/types";
import ReviewForm from "./ReviewForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AsyncProcess, AsyncProcessStatus } from "@/types";
import ProductItem from "./ProductItem";

type FormData = {
  title: string;
  rating: string;
  content: string;
};

const client = generateClient<Schema>({ authMode: "userPool" });

const ReviewEdit = ({ reviewId }: { reviewId: string }) => {
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [reviewUpdateStatus, setReviewUpdateStatus] = useState<
    AsyncProcess<void, Error>
  >({
    status: AsyncProcessStatus.NONE,
  });
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

    if (authStatus === "authenticated") {
      setIsAuthenticated(authStatus === "authenticated");
      setUserId(user.userId);

      fetchReview();
    }
  }, [authStatus, user, reviewId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!review?.productId) {
        return;
      }
      const result = await client.models.Product.get(
        { id: review.productId },
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

      setProduct(result.data);
    };

    if (review && review.productId) {
      fetchProduct();
    }
  }, [review]);

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
        sentimentProcessed: false,
      });

      setReviewUpdateStatus({
        status: AsyncProcessStatus.SUCCESS,
        value: undefined,
      });
    } catch (error) {
      console.error("error creating review", error);

      if (error instanceof Error) {
        setReviewUpdateStatus({
          status: AsyncProcessStatus.ERROR,
          error: error,
        });
      }
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
      {reviewUpdateStatus.status === AsyncProcessStatus.ERROR && (
        <Alert variation="error">Error creating review</Alert>
      )}

      {reviewUpdateStatus.status === AsyncProcessStatus.SUCCESS && (
        <Alert variation="success">Review updated successfully.</Alert>
      )}

      {reviewUpdateStatus.status === AsyncProcessStatus.NONE &&
        !review?.productId && <Text>Product ID is missing.</Text>}

      {product && (
        <ProductItem
          product={product}
          isSignedIn={isAuthenticated}
          showControls={false}
        />
      )}

      {reviewUpdateStatus.status === AsyncProcessStatus.NONE &&
        review?.productId && (
          <ReviewForm
            onSubmit={onSubmit}
            review={review}
            setReview={setReview}
            productId={review?.productId}
            userId={userId}
          />
        )}
    </Card>
  );
};
export default ReviewEdit;
