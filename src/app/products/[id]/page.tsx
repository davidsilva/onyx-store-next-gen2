import { cookieBasedClient } from "@/utils/amplify-utils";
import {
  checkIsAuthenticated,
  getCurrentUserServer,
} from "@/utils/amplify-utils";
import ImageCarousel from "@/components/ImageCarousel";
import { getUserProfile } from "@/actions/getUserProfile";
import { AuthUser } from "aws-amplify/auth";
import ReviewItem from "@/components/ReviewItem";

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  let currentUser: AuthUser | null = null;
  const isSignedIn = await checkIsAuthenticated();
  if (isSignedIn) {
    currentUser = await getCurrentUserServer();
  }
  console.log("currentUser", currentUser);
  let product;
  try {
    const { data, errors } = await cookieBasedClient.models.Product.get(
      { id: params.id },
      {
        authMode: isSignedIn ? "userPool" : "iam",
        selectionSet: [
          "id",
          "name",
          "description",
          "price",
          "mainImageS3Key",
          "isArchived",
          "images.*",
          "reviews.*",
          "reviews.user.*",
        ],
      }
    );
    console.log("cookieBasedClient.models.Product.get data", data);
    product = data;
  } catch (error) {
    console.error("error", error);
  }

  const reviewsWithUserProfiles = await Promise.all(
    product?.reviews?.map(async (review) => {
      console.log("review", review);
      if (review?.userId) {
        const userProfile = await getUserProfile(review.userId);
        return {
          ...review,
          user: userProfile,
        };
      } else {
        return {
          ...review,
          user: null,
        };
      }
    }) || []
  );

  console.log("reviewsWithUserProfiles", reviewsWithUserProfiles);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 p-2">
          <ImageCarousel images={product.images} className="w-full p-6" />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {product?.name}
          </h1>
          <p className="text-2xl text-gray-800">{product?.description}</p>
          <p className="text-2xl text-gray-800">
            {(product.price / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Reviews</h2>
        <div>
          {reviewsWithUserProfiles.length === 0 && <p>No reviews</p>}

          {reviewsWithUserProfiles.map((review) => {
            const reviewItemData = {
              ...review,
              preferredUsername:
                review.user?.preferredUsername || review.userId || "",
              userId: review.userId || "",
            };
            return (
              <div key={review.id}>
                <ReviewItem review={reviewItemData} currentUser={currentUser} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default ProductDetailPage;
