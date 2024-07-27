import { type Schema } from "@/../amplify/data/resource";
import ProductItemControls from "@/components/ProductItemControls";
import ImageComponent from "@/components/Image";

type Nullable<T> = T | null;

type Image = {
  s3Key: Nullable<string>;
  alt?: string | null;
  productId: Nullable<string>;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
  mainImageS3Key: Nullable<string>;
};

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

  // If product.mainImageS3Key is set, show ImageComponent using the image from images that matches the s3Key.
  // Otherwise, show the first image from the images array

  if (product.images.length === 0) {
    mainImage = null;
  } else if (product.mainImageS3Key) {
    mainImage = product.images.find(
      (image) => image.s3Key === product.mainImageS3Key
    );
  }

  const mainImageS3Key = mainImage ? mainImage.s3Key : product.images[0].s3Key;
  const mainImageAlt = mainImage
    ? mainImage.alt || product.name
    : product.images[0].alt || product.name;

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
        <ProductItemControls id={product.id} isSignedIn={isSignedIn} />
      </div>
    </div>
  );
};
export default ProductItem;
