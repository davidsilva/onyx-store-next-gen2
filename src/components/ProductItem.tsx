import ProductItemControls from "@/components/ProductItemControls";
import ImageComponent from "@/components/Image";
import { ProductWithReviews } from "@/types";
import Link from "next/link";

interface ProductItemProps {
  product: ProductWithReviews;
  isSignedIn: boolean;
  showControls?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isSignedIn,
  showControls = true,
}) => {
  if (!product) {
    return null;
  }

  let mainImage = null;
  let mainImageS3Key = null;
  let mainImageAlt = null;

  // If product.mainImageS3Key is set, show ImageComponent using the image from images that matches the s3Key.
  // Otherwise, show the first image from the images array

  if (product.images && product.images.length > 0) {
    mainImage = product.images.find(
      (image) => image.s3Key === product.mainImageS3Key
    );
    if (!mainImage) {
      mainImage = product.images[0];
    }
    mainImageS3Key = mainImage ? mainImage.s3Key : product.images[0].s3Key;
    mainImageAlt = mainImage
      ? mainImage.alt || product.name
      : product.images[0].alt || product.name;
  }

  return (
    <div className="rounded-lg border-black border my-1 p-2 flex gap-2">
      {mainImage && mainImageS3Key && (
        <div>
          <Link href={`/products/${product.id}`}>
            <ImageComponent
              path={mainImageS3Key}
              altText={mainImageAlt || product.name}
            />
          </Link>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h2>
        <p>{product.id}</p>
        <p>{product.description}</p>
        <p>
          {(product.price / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <p>Reviews: {product.reviews?.length || 0}</p>
        {showControls && (
          <ProductItemControls product={product} isSignedIn={isSignedIn} />
        )}
      </div>
    </div>
  );
};
export default ProductItem;
