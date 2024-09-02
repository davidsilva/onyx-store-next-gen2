import ReviewCreate from "@/components/ReviewCreate";

const ReviewCreatePage = ({ params }: { params: { productId: string } }) => {
  return (
    <>
      <div>Review Create Page</div>
      <ReviewCreate productId={params.productId} />
    </>
  );
};
export default ReviewCreatePage;
