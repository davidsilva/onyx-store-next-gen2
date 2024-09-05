"use client";

import { useRouter } from "next/navigation";

const ReviewItemControls = ({ reviewId }: { reviewId: string }) => {
  const router = useRouter();

  const handleReviewEdit = () => {
    router.push(`/reviews/${reviewId}/edit`);
  };

  return (
    <div>
      <button className="btn btn-blue" onClick={handleReviewEdit}>
        Edit
      </button>
    </div>
  );
};
export default ReviewItemControls;
