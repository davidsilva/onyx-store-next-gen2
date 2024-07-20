import { type Schema } from "@/../amplify/data/resource";
import ProductItemControls from "@/components/ProductItemControls";
import ImageComponent from "@/components/Image";

type Image = {
  key: string;
  alt?: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
};

interface ProductItemProps {
  product: Product;
  isSignedIn: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, isSignedIn }) => {
  console.log("ProductItem", product);
  return (
    <div className="rounded-lg border-black border my-1 p-2 flex gap-2">
      {product.images.length > 0 && (
        <div>
          <ImageComponent path={product.images[0].key} altText={product.name} />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p>{product.description}</p>
        <p>
          {product.price.toLocaleString("en-US", {
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
