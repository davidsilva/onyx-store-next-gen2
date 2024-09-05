import ReviewEdit from "@/components/ReviewEdit";

const ReviewEditPage = ({ params }: { params: { reviewId: string } }) => {
  return (
    <div>
      <ReviewEdit reviewId={params.reviewId} />
    </div>
  );
};
export default ReviewEditPage;
