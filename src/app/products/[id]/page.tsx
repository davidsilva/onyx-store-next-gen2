import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated } from "@/utils/amplify-utils";
import { type Schema } from "@/../amplify/data/resource";
import ImageCarousel from "@/components/ImageCarousel";

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const isSignedIn = await checkIsAuthenticated();
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
        ],
      }
    );
    console.log("data", data);
    product = data;
  } catch (error) {
    console.error("error", error);
  }

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
          {product?.reviews.length === 0 && <p>No reviews</p>}

          {product?.reviews.map((review) => (
            <div
              key={review.id}
              className="border border-black rounded p-2 my-6"
            >
              <p>{review.content}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default ProductDetailPage;
