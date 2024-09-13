import { ReviewItem as ReviewItemType } from "@/types";
import Link from "next/link";
import ReviewItemControls from "./ReviewItemControls";

type ReviewItemProps = {
  review: ReviewItemType;
  currentUser: { userId: string } | null;
};

const ReviewItem = ({ review, currentUser }: ReviewItemProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border rounded-md border-gray-800 p-6 my-6">
      {review.productName && (
        <p>
          Product:{" "}
          <strong>
            <Link href={`/products/${review.productId}`}>
              {review.productName}
            </Link>
          </strong>
        </p>
      )}
      <h3 className="text-lg font-bold">
        {renderStars(review.rating)} {review.title}
      </h3>
      {review.preferredUsername && (
        <p>
          By:{" "}
          <Link href={`/user/${review.userId}`}>
            {review.preferredUsername}
          </Link>
        </p>
      )}
      <p className="text-lg">{review.content}</p>
      <p>{formattedDate}</p>
      {currentUser && currentUser.userId === review.userId && (
        <ReviewItemControls reviewId={review.id} />
      )}
    </div>
  );
};
export default ReviewItem;
