import ReviewCreate from "@/components/ReviewCreate";

const ReviewCreatePage = ({ params }: { params: { productId: string } }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">Add Your Review</h1>
      <ReviewCreate productId={params.productId} />
    </>
  );
};
export default ReviewCreatePage;
