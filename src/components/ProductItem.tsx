import { type Schema } from "@/../amplify/data/resource";
import ProductItemControls from "@/components/ProductItemControls";
import ImageComponent from "@/components/Image";

type Product = Schema["Product"]["type"];
interface ProductItemProps {
  product: Product;
  isSignedIn: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, isSignedIn }) => {
  return (
    <div className="rounded-lg border-black border my-1 p-2 flex gap-2">
      {product.image && (
        <div>
          <ImageComponent path={product.image} altText={product.name} />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <div>{product.description}</div>
        <ProductItemControls id={product.id} isSignedIn={isSignedIn} />
      </div>
    </div>
  );
};
export default ProductItem;
