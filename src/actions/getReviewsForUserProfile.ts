import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated } from "@/utils/amplify-utils";
import { ReviewItem as ReviewItemType } from "@/types";

export type ReviewData = ReviewItemType[];

export const getReviewsForUserProfile = async (
  userId: string
): Promise<ReviewData | null> => {
  console.log("Review userId", userId);
  const isSignedIn = await checkIsAuthenticated();
  console.log("isSignedIn", isSignedIn);
  let reviewData: ReviewData | null = null;

  try {
    const { data, errors } =
      await cookieBasedClient.models.Review.listReviewByUserId(
        {
          userId: userId,
        },
        {
          authMode: isSignedIn ? "userPool" : "iam",
          selectionSet: [
            "id",
            "title",
            "content",
            "rating",
            "productId",
            "userId",
            "product.name",
            "createdAt",
          ],
        }
      );

    console.log("data", data);
    console.log("errors", errors);

    if (errors) {
      console.error("errors", errors);
      return null;
    }

    if (data.length === 0) {
      console.error("No data found");
      return null;
    }

    reviewData = data.map((review: any) => ({
      ...review,
      productName: review.product.name,
    })) as ReviewData;
  } catch (error) {
    console.error("error", error);
    return null;
  }

  return reviewData;
};
