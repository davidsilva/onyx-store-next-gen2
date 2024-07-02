import { type Schema } from "@/../amplify/data/resource";
import ProductItemControls from "@/components/ProductItemControls";

type Product = Schema["Product"]["type"];
interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <div>
      <div>{product.name}</div>
      <ProductItemControls id={product.id} />
    </div>
  );
};
export default ProductItem;
