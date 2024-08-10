import { type Schema } from "@/../amplify/data/resource";
import ProductItemControls from "@/components/ProductItemControls";
import ImageComponent from "@/components/Image";
import { Product } from "@/types";

interface ProductItemProps {
  product: Product;
  isSignedIn: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, isSignedIn }) => {
  console.log("ProductItem", product);

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
    console.log("mainImage", mainImage);
    mainImageS3Key = mainImage ? mainImage.s3Key : product.images[0].s3Key;
    mainImageAlt = mainImage
      ? mainImage.alt || product.name
      : product.images[0].alt || product.name;
  }

  return (
    <div className="rounded-lg border-black border my-1 p-2 flex gap-2">
      {mainImage && mainImageS3Key && (
        <div>
          <ImageComponent
            path={mainImageS3Key}
            altText={mainImageAlt || product.name}
          />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p>{product.description}</p>
        <p>
          {(product.price / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <ProductItemControls product={product} isSignedIn={isSignedIn} />
      </div>
    </div>
  );
};
export default ProductItem;
