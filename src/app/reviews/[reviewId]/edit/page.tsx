import ReviewEdit from "@/components/ReviewEdit";

const ReviewEditPage = ({ params }: { params: { reviewId: string } }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">Edit Your Review</h1>
      <ReviewEdit reviewId={params.reviewId} />
    </>
  );
};
export default ReviewEditPage;
